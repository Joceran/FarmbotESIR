module Api
  class SuggestionsController < Api::AbstractController

	#GET /api/suggestion_bylist
	def getByList
		suggs = Suggestion.where(listSuggestion_id: params.as_json["id"]);
		json = "{ \"entries\":[";
		suggs.all.each do |sugg|
		  json = json+"{";
		  json = json+"\"id\" : \"" + sugg.id.to_s + "\", \"plantId\" : \""+sugg.plantId+"\", \"plantSlug\" : \""+sugg.plantSlug+"\", \"quantity\" : \""+sugg.quantity.to_s+"\", \"becauseOf\" : \""+sugg.becauseOf+"\"";
		  json = json+"},";
		end
		json = json.chomp(",")+"]}";
		render json: json;
	end
	
	#POST /api/suggestion
    def create
      mutate Suggestions::Create.run(listSuggestion_id: params["listSuggestion"], plantId: params["plantId"], plantSlug: params["plantSlug"], quantity: params["quantity"], becauseOf: params["becauseOf"])
    end
  end
end
