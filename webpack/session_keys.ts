import { BooleanConfigKey, NumberConfigKey } from "./config_storage/web_app_configs";

export const BooleanSetting: Record<BooleanConfigKey, BooleanConfigKey> = {
  x_axis_inverted: "x_axis_inverted",
  y_axis_inverted: "y_axis_inverted",
  z_axis_inverted: "z_axis_inverted",
  raw_encoders: "raw_encoders",
  scaled_encoders: "scaled_encoders",
  legend_menu_open: "legend_menu_open",
  show_plants: "show_plants",
  show_points: "show_points",
  show_spread: "show_spread",
  show_farmbot: "show_farmbot",
  show_images: "show_images",

  /** "Labs" feature names. (App preferences) */
  stub_config: "stub_config",
  disable_i18n: "disable_i18n",
  confirm_step_deletion: "confirm_step_deletion",
  hide_webcam_widget: "hide_webcam_widget",
  dynamic_map: "dynamic_map",
  map_xl: "map_xl",
  disable_animations: "disable_animations",
  display_trail: "display_trail",
  encoder_figure: "encoder_figure",
  enable_browser_speak: "enable_browser_speak",
  discard_unsaved: "discard_unsaved",

  /** Farmware Settings Panel */
  show_first_party_farmware: "show_first_party_farmware",
};

export const NumericSetting: Record<NumberConfigKey, NumberConfigKey> = {
  bot_origin_quadrant: "bot_origin_quadrant",
  busy_log: "busy_log",
  debug_log: "debug_log",
  device_id: "device_id",
  error_log: "error_log",
  fun_log: "fun_log",
  id: "id",
  info_log: "info_log",
  success_log: "success_log",
  warn_log: "warn_log",
  zoom_level: "zoom_level",
};
