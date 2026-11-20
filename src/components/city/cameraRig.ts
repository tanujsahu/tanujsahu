export const cameraRig = {
  angle: 0.4,
  radius: 48,
  height: 26,
};

/** Horizontal orbit angle. Movement uses this so controls follow the camera. */
export const cameraAim = {
  yaw: 0.64,
};

/** True after a look-around drag, so that drag does not also walk or open a building. */
export const pointerIntent = {
  dragging: false,
};
