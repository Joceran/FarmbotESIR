module Api
  class SuggestionsController < Api::AbstractController
    def create
      mutate Suggestions::Create.run(data)
    end
  end

end



      
