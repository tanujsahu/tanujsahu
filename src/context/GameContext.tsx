"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from "react";
import { getLocation, locations, playerSpawn } from "@/data/locations";
import { setAmbientEnabled } from "@/lib/audio";
import {
  INTERACT_RADIUS,
  dismountRide,
  distanceToEntrance,
  mountRide,
  stepPlayer,
  type PlayerState,
  type TravelTarget,
} from "@/lib/movement";
import { nearestVehicle, rideState, vehicles, type VehicleId } from "@/data/vehicles";
import { detectWebGL } from "@/lib/utils";

export type ViewMode = "intro" | "explore" | "classic";
export type GraphicsQuality = "balanced" | "high";
export type RenderPreference = "auto" | "3d" | "map";
export type MotionPreference = "system" | "reduce" | "allow";
export type VehicleFinish = "light" | "dark";

interface InputVector {
  x: number;
  z: number;
}

interface GameContextValue {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  graphics: GraphicsQuality;
  setGraphics: (quality: GraphicsQuality) => void;
  renderPreference: RenderPreference;
  setRenderPreference: (preference: RenderPreference) => void;
  webglAvailable: boolean | null;
  useMap: boolean;
  soundOn: boolean;
  toggleSound: () => void;
  reducedMotion: boolean;
  motionPreference: MotionPreference;
  setMotionPreference: (preference: MotionPreference) => void;
  discovered: string[];
  nearestId: string | null;
  activeId: string | null;
  openLocation: (id: string) => void;
  closeLocation: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  hint: string | null;
  setHint: (hint: string | null) => void;
  playerRef: RefObject<PlayerState>;
  joystickRef: MutableRefObject<InputVector>;
  walkRef: MutableRefObject<TravelTarget | null>;
  freeRoam: boolean;
  toggleFreeRoam: () => void;
  vehicleFinish: VehicleFinish;
  setVehicleFinish: (finish: VehicleFinish) => void;
  walkTo: (x: number, z: number) => void;
  travelTo: (id: string) => void;
  interact: () => void;
  ride: VehicleId | "walk";
  nearestVehicleId: VehicleId | null;
  toggleRide: (id?: VehicleId) => void;
  sceneReady: boolean;
  setSceneReady: (ready: boolean) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const emptyInput = { x: 0, z: 0 };

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T) {
  const value = window.localStorage.getItem(key);
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [mode, setModeState] = useState<ViewMode>("intro");
  const [graphics, setGraphicsState] = useState<GraphicsQuality>("high");
  const [renderPreference, setRenderPreferenceState] =
    useState<RenderPreference>("auto");
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [motionPreference, setMotionPreferenceState] =
    useState<MotionPreference>("system");
  const [systemReduced, setSystemReduced] = useState(false);
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [nearestId, setNearestId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hint, setHintState] = useState<string | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [freeRoam, setFreeRoam] = useState(false);
  const [vehicleFinish, setVehicleFinishState] = useState<VehicleFinish>("dark");
  const [ride, setRide] = useState<VehicleId | "walk">("walk");
  const [nearestVehicleId, setNearestVehicleId] = useState<VehicleId | null>(null);

  const playerRef = useRef<PlayerState>({
    x: playerSpawn.x,
    z: playerSpawn.z,
    yaw: playerSpawn.yaw,
    walking: false,
    traveling: false,
  });
  const keyboardRef = useRef<InputVector>({ ...emptyInput });
  const joystickRef = useRef<InputVector>({ ...emptyInput });
  const travelRef = useRef<TravelTarget | null>(null);
  const walkRef = useRef<TravelTarget | null>(null);
  const freeRoamRef = useRef(false);
  const modeRef = useRef(mode);
  const pausedRef = useRef(false);
  const nearestRef = useRef<string | null>(null);
  const hintTimer = useRef<number | null>(null);

  const reducedMotion =
    motionPreference === "system" ? systemReduced : motionPreference === "reduce";

  const useMap = renderPreference === "map" || webglAvailable !== true;

  useEffect(() => {
    modeRef.current = mode;
    pausedRef.current = Boolean(activeId || menuOpen || settingsOpen);
    nearestRef.current = nearestId;
  }, [activeId, menuOpen, mode, nearestId, settingsOpen]);

  const setHint = useCallback((value: string | null) => {
    if (hintTimer.current) window.clearTimeout(hintTimer.current);
    setHintState(value);
    if (value) {
      hintTimer.current = window.setTimeout(() => setHintState(null), 4200);
    }
  }, []);

  const setMode = useCallback((next: ViewMode) => {
    setModeState(next);
    setActiveId(null);
    setMenuOpen(false);
    setSettingsOpen(false);
    try {
      window.localStorage.setItem(
        "portfolio-view",
        next === "classic" ? "classic" : "city",
      );
      const url = new URL(window.location.href);
      if (next === "classic") url.searchParams.set("view", "classic");
      else url.searchParams.delete("view");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // Storage and history can fail in private contexts. The view still changes.
    }
  }, []);

  const openLocation = useCallback((id: string) => {
    if (!getLocation(id)) return;
    setActiveId(id);
    setMenuOpen(false);
    setHintState(null);
    setDiscovered((current) => (current.includes(id) ? current : [...current, id]));
  }, []);

  const closeLocation = useCallback(() => setActiveId(null), []);

  const travelTo = useCallback(
    (id: string) => {
      const location = getLocation(id);
      if (!location) return;
      if (rideState.mode !== "walk") {
        dismountRide(playerRef.current);
        setRide("walk");
      }
      travelRef.current = { x: location.entrance[0], z: location.entrance[1] };
      walkRef.current = null;
      setMenuOpen(false);
      setActiveId(null);
      if (modeRef.current !== "explore") setMode("explore");
    },
    [setMode],
  );

  const toggleFreeRoam = useCallback(() => {
    const next = !freeRoamRef.current;
    freeRoamRef.current = next;
    setFreeRoam(next);
    setHint(
      next
        ? "Free roam is on. Walk anywhere, or click the ground to go there."
        : "Free roam is off. Buildings block the path again.",
    );
  }, [setHint]);

  const toggleRide = useCallback((requested?: VehicleId) => {
    if (modeRef.current !== "explore" || pausedRef.current) return;
    const player = playerRef.current;
    travelRef.current = null;
    walkRef.current = null;
    if (rideState.mode !== "walk") {
      dismountRide(player);
      setRide("walk");
      setHint("You stepped off.");
      return;
    }
    const nearby = requested ?? nearestVehicle(player.x, player.z);
    if (!nearby) {
      setHint("Walk up to the bike or the car, then press V.");
      return;
    }
    const vehicle = vehicles[nearby];
    const distance = Math.hypot(player.x - vehicle.x, player.z - vehicle.z);
    const reach = nearby === "car" ? 3.2 : 2.5;
    if (distance > reach) {
      setHint(nearby === "car" ? "Walk closer to drive the car." : "Walk closer to ride the bike.");
      return;
    }
    mountRide(player, nearby);
    setRide(nearby);
    setHint(nearby === "car" ? "You're driving. Press V to step off." : "You're riding. Press V to step off.");
  }, [setHint]);

  const walkTo = useCallback(
    (x: number, z: number) => {
      walkRef.current = { x, z };
      travelRef.current = null;
      if (modeRef.current === "intro") setMode("explore");
    },
    [setMode],
  );

  const interact = useCallback(() => {
    const id = nearestRef.current;
    if (!id || modeRef.current !== "explore" || pausedRef.current) return;
    openLocation(id);
  }, [openLocation]);

  const toggleSound = useCallback(() => {
    setSoundOn((current) => {
      const next = !current;
      setAmbientEnabled(next);
      return next;
    });
  }, []);

  const setGraphics = useCallback((quality: GraphicsQuality) => {
    setGraphicsState(quality);
    window.localStorage.setItem("portfolio-graphics", quality);
  }, []);

  const setRenderPreference = useCallback((preference: RenderPreference) => {
    setRenderPreferenceState(preference);
    window.localStorage.setItem("portfolio-render", preference);
    setSceneReady(false);
  }, []);

  const setMotionPreference = useCallback((preference: MotionPreference) => {
    setMotionPreferenceState(preference);
    window.localStorage.setItem("portfolio-motion", preference);
  }, []);

  const setVehicleFinish = useCallback((finish: VehicleFinish) => {
    setVehicleFinishState(finish);
    window.localStorage.setItem("portfolio-vehicle-finish", finish);
  }, []);

  // Browser preferences are applied once after hydration so server HTML and the first client render match.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setSystemReduced(media.matches);
    apply();
    media.addEventListener("change", apply);

    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    const focus = params.get("focus");
    const savedView = window.localStorage.getItem("portfolio-view");
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    setWebglAvailable(detectWebGL());
    setGraphicsState(
      readStored(
        "portfolio-graphics",
        ["balanced", "high"] as const,
        mobile ? "balanced" : "high",
      ),
    );
    setRenderPreferenceState(
      readStored("portfolio-render", ["auto", "3d", "map"] as const, "auto"),
    );
    setMotionPreferenceState(
      readStored(
        "portfolio-motion",
        ["system", "reduce", "allow"] as const,
        "system",
      ),
    );
    setVehicleFinishState(
      readStored("portfolio-vehicle-finish", ["light", "dark"] as const, "dark"),
    );

    const storedDiscovered = window.sessionStorage.getItem("portfolio-discovered");
    if (storedDiscovered) {
      try {
        const parsed = JSON.parse(storedDiscovered) as unknown;
        if (Array.isArray(parsed)) {
          const ids = parsed.filter(
            (id): id is string =>
              typeof id === "string" && locations.some((location) => location.id === id),
          );
          setDiscovered(ids);
        }
      } catch {
        window.sessionStorage.removeItem("portfolio-discovered");
      }
    }

    if (focus && getLocation(focus)) {
      const location = getLocation(focus);
      if (location) {
        playerRef.current.x = location.entrance[0];
        playerRef.current.z = location.entrance[1];
      }
      setModeState("explore");
      setActiveId(focus);
      setDiscovered((current) =>
        current.includes(focus) ? current : [...current, focus],
      );
    } else if (view === "classic" || window.location.hash || (!view && savedView === "classic")) {
      setModeState("classic");
    } else if (view === "city" && savedView === "city") {
      setModeState("explore");
    }

    setHydrated(true);

    return () => media.removeEventListener("change", apply);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    window.sessionStorage.setItem(
      "portfolio-discovered",
      JSON.stringify(discovered),
    );
  }, [discovered, hydrated]);

  useEffect(() => {
    const pressed = new Set<string>();

    const publishKeys = () => {
      const up = pressed.has("w") || pressed.has("arrowup");
      const down = pressed.has("s") || pressed.has("arrowdown");
      const left = pressed.has("a") || pressed.has("arrowleft");
      const right = pressed.has("d") || pressed.has("arrowright");
      let x = (right ? 1 : 0) - (left ? 1 : 0);
      let z = (down ? 1 : 0) - (up ? 1 : 0);
      const magnitude = Math.hypot(x, z);
      if (magnitude > 1) {
        x /= magnitude;
        z /= magnitude;
      }
      keyboardRef.current.x = x;
      keyboardRef.current.z = z;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (window.location.pathname !== "/") return;

      const key = event.key.toLowerCase();
      if (
        key === "arrowup" ||
        key === "arrowdown" ||
        key === "arrowleft" ||
        key === "arrowright" ||
        key === " "
      ) {
        event.preventDefault();
      }

      if (key === "escape") {
        if (activeId) setActiveId(null);
        else if (settingsOpen) setSettingsOpen(false);
        else if (menuOpen) setMenuOpen(false);
        return;
      }

      if (key === "e" && !event.repeat) {
        if (modeRef.current === "explore" && !pausedRef.current && nearestRef.current) {
          openLocation(nearestRef.current);
        }
        return;
      }

      if (key === "c" && !event.repeat && modeRef.current !== "classic") {
        setMode("classic");
        return;
      }

      if (key === "m" && !event.repeat && modeRef.current !== "classic") {
        setMenuOpen((open) => !open);
        return;
      }

      if (key === "f" && !event.repeat && modeRef.current !== "classic") {
        toggleFreeRoam();
        return;
      }

      if (key === "v" && !event.repeat && modeRef.current === "explore") {
        toggleRide();
        return;
      }

      if (
        key === "w" ||
        key === "a" ||
        key === "s" ||
        key === "d" ||
        key === "arrowup" ||
        key === "arrowdown" ||
        key === "arrowleft" ||
        key === "arrowright"
      ) {
        pressed.add(key);
        publishKeys();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      pressed.delete(event.key.toLowerCase());
      publishKeys();
    };

    const clear = () => {
      pressed.clear();
      keyboardRef.current.x = 0;
      keyboardRef.current.z = 0;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clear);
      clear();
    };
  }, [activeId, menuOpen, openLocation, setMode, settingsOpen, toggleFreeRoam, toggleRide]);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let lastNearest: string | null = null;
    let lastVehicle: VehicleId | null = null;

    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      if (modeRef.current !== "classic") {
        const input = {
          x: keyboardRef.current.x + joystickRef.current.x,
          z: keyboardRef.current.z + joystickRef.current.z,
        };
        const magnitude = Math.hypot(input.x, input.z);
        if (magnitude > 1) {
          input.x /= magnitude;
          input.z /= magnitude;
        }

        const step = stepPlayer(
          playerRef.current,
          input,
          travelRef.current,
          walkRef.current,
          dt,
          modeRef.current === "explore" && !pausedRef.current,
          freeRoamRef.current,
        );
        travelRef.current = step.travel;
        walkRef.current = step.walk;
        if (rideState.mode !== "walk") {
          const vehicle = vehicles[rideState.mode];
          vehicle.x = playerRef.current.x;
          vehicle.z = playerRef.current.z;
          vehicle.yaw = playerRef.current.yaw;
        }

        const nearbyRide =
          rideState.mode === "walk"
            ? nearestVehicle(playerRef.current.x, playerRef.current.z)
            : null;
        if (nearbyRide !== lastVehicle) {
          lastVehicle = nearbyRide;
          setNearestVehicleId(nearbyRide);
        }

        let best: string | null = null;
        let bestDistance = INTERACT_RADIUS;
        for (const location of locations) {
          const distance = distanceToEntrance(
            playerRef.current.x,
            playerRef.current.z,
            location,
          );
          if (distance < bestDistance) {
            bestDistance = distance;
            best = location.id;
          }
        }
        if (best !== lastNearest) {
          lastNearest = best;
          nearestRef.current = best;
          setNearestId(best);
        }
      }

      frame = window.requestAnimationFrame(loop);
    };

    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      mode,
      setMode,
      graphics,
      setGraphics,
      renderPreference,
      setRenderPreference,
      webglAvailable,
      useMap,
      soundOn,
      toggleSound,
      reducedMotion,
      motionPreference,
      setMotionPreference,
      discovered,
      nearestId,
      activeId,
      openLocation,
      closeLocation,
      menuOpen,
      setMenuOpen,
      settingsOpen,
      setSettingsOpen,
      hint,
      setHint,
      playerRef,
      joystickRef,
      walkRef,
      freeRoam,
      toggleFreeRoam,
      vehicleFinish,
      setVehicleFinish,
      walkTo,
      travelTo,
      interact,
      ride,
      nearestVehicleId,
      toggleRide,
      sceneReady,
      setSceneReady,
    }),
    [
      activeId,
      closeLocation,
      discovered,
      freeRoam,
      graphics,
      hint,
      interact,
      menuOpen,
      mode,
      motionPreference,
      nearestId,
      nearestVehicleId,
      openLocation,
      reducedMotion,
      renderPreference,
      ride,
      sceneReady,
      setGraphics,
      setHint,
      setMode,
      setMotionPreference,
      setRenderPreference,
      setVehicleFinish,
      settingsOpen,
      soundOn,
      toggleFreeRoam,
      toggleRide,
      toggleSound,
      travelTo,
      walkTo,
      useMap,
      vehicleFinish,
      webglAvailable,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
