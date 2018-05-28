module Api
  class SuggestionsController < Api::AbstractController

    def create
      @plants = Plants.all
      @suggests = Suggestions.all
      mutate Suggestions::Create.run(data)
    end

    def update
      @suggest = Suggestions.all
      @plants = Plants.all
    end

    def recommandations()
      puts "\n Voici vos recommandations"
      @plants.each do |crop|
          cropTemp = getCropFromName(crop.openfarm_slug)
          crop_companions_data = cropTemp.data.relationships.companions.data
          crop_companions_data.each do |datum|
              unless(@plants.include? getSlugFromId(datum.id))
                  suggestedCrop = getCropFromName(getSlugFromId(datum.id))
                  newEntry = Suggestions.newEntry
                  newEntry.plantId = suggestedCrop.id
                  newEntry.plantSlug = suggestedCrop.attributes.slug
                  newEntry.becauseOf = crop.openfarm_slug

                  puts " - #{suggestedCrop.data.attributes.name}"
              end
          end
      end
  end

  def list()
      puts "\n"
      @suggest.each do |suggest|
          puts " - #{getCropFromName(suggest.slug).data.attributes.name}"
      end
  end

  def getCropFromName(name)
      encoded_name = URI::encode(name)
      url = "http://openfarm.cc/api/v1/crops/?filter=#{encoded_name}"
      response = HTTParty.get(url)

      #puts response.body, response.code, response.message, response.headers.inspect

      crop = ''
      json_string = response.body
      datas = JSON.parse(json_string, object_class: OpenStruct)['data']
      datas.each do |data|
          if data.attributes.slug == name
              crop = getCropFromId(data.id)
          end
      end

      unless crop.nil?
          puts crop.data.attributes.slug
      end
  end

  def getCropFromId(id)
      url = "http://openfarm.cc/api/v1/crops/#{id}"
      response = HTTParty.get(url)

      #puts response.body, response.code, response.message, response.headers.inspect

      json_string = response.body
      json_object = JSON.parse(json_string, object_class: OpenStruct)
      
      return json_object
  end

  def getSlugFromId(id)
    url = "http://openfarm.cc/api/v1/crops/#{id}"
    response = HTTParty.get(url)

    #puts response.body, response.code, response.message, response.headers.inspect

    json_string = response.body
    json_object = JSON.parse(json_string, object_class: OpenStruct)
    
    return json_object.data.attributes.slug
end
end
