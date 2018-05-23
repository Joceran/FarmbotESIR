# Creates asymetric key pairs for cryptographically secure operations.
# Mostly used for creation of jwt.pem- which is used to verify authenticity of
# JSON Web Tokens
class KeyGen
  PROD_KEY_FILE    = "/keys/production.pem"
  KEY_FILE         = "jwt.#{Rails.env}.pem"
  SAVE_PATH        = (Rails.env == "production") ? PROD_KEY_FILE : KEY_FILE

  def self.try_file
    OpenSSL::PKey::RSA.new(File.read(SAVE_PATH)) if File.file?(SAVE_PATH)
  end

  def self.generate_new_key(path = SAVE_PATH)
    rsa = OpenSSL::PKey::RSA.generate(2048)
    File.open(path, 'w') { |f| f.write(rsa.to_pem) }
    return rsa
  end

  # Heroku / 12Factor users can't store stuff on the file system. Store your pem
  # file in ENV['RSA_KEY'] if that applies to you.
  def self.try_env
    OpenSSL::PKey::RSA.new(ENV['RSA_KEY']) if ENV['RSA_KEY']
  end

  # Lazy loads a crypto key.  Will look in ENV['RSA_KEY'], then
  # jwt.environment_name.pem. Generates new key if neither is available.
  def self.current
    @current ||= ( try_env || try_file || generate_new_key)
  end
end
