# Generates a JSON Web Token (JWT) for a given user. Typically placed in the
# `Authorization` header, or used a password to gain access to the MQTT server.
class SessionToken < AbstractJwtToken
  MUST_VERIFY  = "Verify account first"
  MQTT         = ENV.fetch("MQTT_HOST")
  # No beta URL provided? Then provide the latest stable.
  DEFAULT_BETA_URL = \
    "https://api.github.com/repos/FarmBot/farmbot_os/releases/latest"
  # If you are not using the standard MQTT broker (eg: you use a 3rd party
  # MQTT vendor), you will need to change this line.
  DEFAULT_MQTT_WS = \
    "#{ENV["FORCE_SSL"] ? "wss://" : "ws://"}#{ENV.fetch("MQTT_HOST")}:3002/ws"
  MQTT_WS         = ENV["MQTT_WS"] || DEFAULT_MQTT_WS
  EXPIRY          = 40.days
  VHOST           = ENV.fetch("MQTT_VHOST") { "/" }
  BETA_OS_URL     = ENV["BETA_OTA_URL"] || DEFAULT_BETA_URL
  def self.issue_to(user,
                    iat: Time.now.to_i,
                    exp: EXPIRY.from_now.to_i,
                    iss: $API_URL,
                    aud: AbstractJwtToken::UNKNOWN_AUD,
                    fbos_version:) # Gem::Version

    unless user.verified?
      Rollbar.info("Verification Error", email: user.email)
      raise Errors::Forbidden, MUST_VERIFY
    end
    url = CalculateUpgrade.run!(version: fbos_version)
    jti = SecureRandom.uuid
    TokenIssuance.create!(device_id: user.device.id, exp: exp, jti: jti)
    self.new([{ aud:                   aud,
                sub:                   user.id,
                iat:                   iat,
                jti:                   jti,
                iss:                   iss,
                exp:                   exp,
                mqtt:                  MQTT,
                bot:                   "device_#{user.device.id}",
                vhost:                 VHOST,
                mqtt_ws:               MQTT_WS,
                os_update_server:      url,
                interim_email:         user.email, # Dont use this for anything ever -RC
                fw_update_server:      "DEPRECATED",
                beta_os_update_server: BETA_OS_URL }])
  end

  def self.as_json(user, aud, fbos_version)
    { token: SessionToken.issue_to(user, iss: $API_URL,
                                         aud: aud,
                                         fbos_version: fbos_version),
      user:  user }
  end
end
