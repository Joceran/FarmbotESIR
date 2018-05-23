class DashboardController < ApplicationController
  before_action :set_global_config

  def tos_update
    # I want to keep an eye on this one in prod.
    # If `tos_update` is firing without us knowing about it, it could cause a
    # service outage.
    Rollbar.info("TOS UPDATE????")
    render :tos_update, layout: false
  end

  [:main_app, :front_page, :verify, :password_reset].map do |actn|
    define_method(actn) do
      begin
        response.headers["Cache-Control"] = "no-cache, no-store"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        render actn, layout: false
      rescue ActionView::MissingTemplate => q
        raise ActionController::RoutingError, "Bad URL in dashboard"
      end
    end
  end

  def verify
    user   = params[:token] && User.find_by!(confirmation_token: params[:token])
    # Two use cases:                  re-confirmation   Email change
    klass  = user.unconfirmed_email? ? Users::Reverify : Users::Verify
    @token = klass.run!(user: user).to_json
    render :confirmation_page, layout: false
  rescue User::AlreadyVerified
    @already_registered = true
    render :confirmation_page, layout: false, status: 409
  end

  # Endpoint reports CSP violations, indicating a possible security problem.
  def csp_reports
    payload = request.body.read || ""
    begin
      report = JSON.parse(payload)
    rescue
      report = {problem: "Crashed while parsing report"}
    end
    Rollbar.error("CSP VIOLATION!!!", report)

    render json: report
  end

  # (for self hosted users) Direct image upload endpoint.
  # Do not use this if you use GCS- it will slow your app down.
  def direct_upload
    raise "No." unless Api::ImagesController.store_locally
    name        = params.fetch(:key).split("/").last
    path        = File.join("public", "direct_upload", "temp", name)
    File.open(path, "wb") { |f| f.write(params[:file]) }
    render json: ""
  end

private

  def set_global_config
    @global_config = GlobalConfig.dump.to_json
  end
end
