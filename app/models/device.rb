# Farmbot Device models all data related to an actual FarmBot in the real world.
class Device < ApplicationRecord
  DEFAULT_MAX_LOGS    = 100
  DEFAULT_MAX_IMAGES  = 100
  DEFAULT_MAX_CONFIGS = 100

  TIMEZONES           = TZInfo::Timezone.all_identifiers
  BAD_TZ              = "%{value} is not a valid timezone"
  THROTTLE_ON         = "Device is sending too many logs. " \
                        "Suspending log storage until %s."
  THROTTLE_OFF        = "Cooldown period has ended. "\
                        "Resuming log transmission."
  CACHE_KEY           = "devices.%s"

  has_many  :device_configs,  dependent: :destroy
  has_many  :farm_events,     dependent: :destroy
  has_many  :farmware_installations, dependent: :destroy
  has_many  :images,          dependent: :destroy
  has_many  :logs,            dependent: :destroy
  has_many  :peripherals,     dependent: :destroy
  has_many  :pin_bindings,    dependent: :destroy
  has_many  :plant_templates, dependent: :destroy
  has_many  :points,          dependent: :destroy
  has_many  :regimens,        dependent: :destroy
  has_many  :saved_gardens,   dependent: :destroy
  has_many  :sensor_readings, dependent: :destroy
  has_many  :sensors,         dependent: :destroy
  has_many  :sequences,       dependent: :destroy
  has_many  :token_issuances, dependent: :destroy
  has_many  :tools,           dependent: :destroy
  has_many  :webcam_feeds,    dependent: :destroy
  has_one   :fbos_config,     dependent: :destroy
  has_many  :in_use_tools
  has_many  :in_use_points

  has_many  :users
  validates_presence_of :name
  validates :timezone,
    inclusion: { in: TIMEZONES, message: BAD_TZ, allow_nil: true }
  [FbosConfig, FirmwareConfig, WebAppConfig].map do |klass|
    name = klass.table_name.singularize.to_sym
    has_one name, dependent: :destroy
    define_method(name) { super() || klass.create!(device: self) }
  end

  # Give the user back the amount of logs they are allowed to view.
  def limited_log_list
    Log
      .order(created_at: :desc)
      .where(device_id: self.id)
      .limit(max_log_count || DEFAULT_MAX_LOGS)
  end

  def self.current
    RequestStore.store[:device]
  end

  def self.current=(dev)
    RequestStore.store[:device] = dev
  end

  # Sets Device.current to `self` and returns it to the previous value when
  #  finished running block. Usually this is unecessary, but may be required in
  # background jobs. If you are not receiving auto_sync data on your client,
  # you probably need to use this method.
  def auto_sync_transaction
    prev           = Device.current
    Device.current = self
    yield
    Device.current = prev
  end

  def tz_offset_hrs
    Time.now.in_time_zone(self.timezone || "UTC").utc_offset / 1.hour
  end

  # Send a realtime message to a logged in user.
  def tell(message, channels = [], type = "info")
    log  = Log.new({ device:        self,
                     message:       message,
                     created_at:    Time.now,
                     channels:      channels,
                     major_version: 99,
                     minor_version: 99,
                     meta:          {},
                     type:          type })
    json = LogSerializer.new(log).as_json.to_json

    Transport.current.amqp_send(json, self.id, "logs")
    log
  end

  def plants
    points.where(pointer_type: "Plant")
  end

  # Like Device.find, but with 150 seconds of caching to avoid DB calls.
  def self.cached_find(id)
    Rails
      .cache
      .fetch(CACHE_KEY % id, expires_in: 150.seconds) { Device.find(id) }
  end

  def refresh_cache
    # Why? Device.new(self.as_json)???
    #
    # "Some objects cannot be dumped: if the objects to be dumped include
    # bindings, procedure or method objects, instances of class IO, or singleton
    # objects, a TypeError will be raised."
    # https://ruby-doc.org/core-2.3.1/Marshal.html
    # TODO: Someone plz send help! - RC
    Rails.cache.write(CACHE_KEY % self.id, Device.new(self.as_json))
  end

  # Sets the `throttled_at` field, but only if it is unpopulated.
  # Performs no-op if `throttled_at` was already set.
  def maybe_throttle_until(until_time)
    if throttled_until.nil?
      update_attributes!(throttled_until: until_time, throttled_at: Time.now)
      refresh_cache
      cooldown = until_time.in_time_zone(self.timezone || "UTC").strftime("%I:%M%p")
      cooldown_notice(THROTTLE_ON % [cooldown], until_time)
    end
  end

  def maybe_unthrottle
    if throttled_until.present?
      old_time = throttled_until
      update_attributes!(throttled_until: nil, throttled_at: Time.now)
      refresh_cache
      cooldown_notice(THROTTLE_OFF, old_time)
    end
  end

  def cooldown_notice(message, throttle_time, now = Time.current)
    hours = ((throttle_time - now) / 1.hour).round
    tell(message, [(hours > 2) ? "email" : "toast"], "alert")
  end
end
