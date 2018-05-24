#!/usr/bin/env ruby
require 'httparty'
require 'uri'
require 'json'

class Suggestion

    attr_accessor :crops
    attr_accessor :suggests

    def initialize()
        @crops = []
        @suggests = []

    end

    def recommandations()
        puts "\n Voici vos recommandations"
        @crops.each do |crop|
            crop_companions_data = crop.data.relationships.companions.data
            crop_companions_data.each do |datum|
                unless(@crops.include? datum.id)
                    suggestedCrop = getCropFromId(datum.id)
                    suggests << suggestedCrop
                    puts " - #{suggestedCrop.data.attributes.name}"
                end
            end
        end
    end



    def list()
        puts "\n"
        @crops.each do |crop|
            puts " - #{crop.data.attributes.name}"
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
            if data.attributes.name == name
                crop = getCropFromId(data.id)
                @crops << crop
            end
        end

        unless crop.nil?
            puts crop.data.attributes.name, crop.data.attributes.binomial_name
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
end

if __FILE__ == $0
    sug = Suggestion.new
    puts "\nSearching Potato by ID : 54c7650e6236310003000000"
    potato = sug.getCropFromId("54c7650e6236310003000000")
    puts potato.data.attributes.name, potato.data.attributes.binomial_name 



    cropName = "Purple Potato"
    puts "\nSearching #{cropName} by Name"
    sug.getCropFromName(cropName)

    cropName = "Eggplant"
    puts "\nSearching #{cropName} by Name"
    sug.getCropFromName(cropName)

    sug.list

    sug.recommandations
end