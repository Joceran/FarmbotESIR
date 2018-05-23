module Api
  class ToolsController < Api::AbstractController
    def index
      render json: tools
    end

    def show
      render json: tool
    end

    def destroy
      mutate Tools::Destroy.run(tool: tool)
    end

    def create
      mutate Tools::Create.run(raw_json, device: current_device)
    end

    def update
      mutate Tools::Update.run(update_params)
    end

private

    def update_params
      output = raw_json.merge(tool: tool)
      output[:name] = params[:name] if params[:name]
      output
    end

    def tools
      Tool.includes(:tool_slot).where(device: current_device)
    end

    def tool
      @tool ||= tools.find(params[:id])
    end
  end
end
