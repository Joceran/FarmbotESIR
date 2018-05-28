module Api
  class SuggestionsController < Api::AbstractController
	#GET /api/suggestion
	def index
		allSuggestions = Suggestion.all;
		#affiche dans la console les suggestions
		puts allSuggestions;
		Suggestion.all.each do |sugg|
		  puts "Id : " + sugg.id.to_s + "; Data : "+sugg.data;
		end
	end
	
	#POST /api/suggestion
    def create
      puts params.as_json;
      #mutate Suggestions::Create.run(data: "tomate")
    end
  end
end
