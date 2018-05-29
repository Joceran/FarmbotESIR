class Suggestions < ActiveRecord::Migration[5.1]
  def change
	drop_table :suggestions
    create_table :suggestions do |t|
      #Id of the suggest
      #t.belongs_to :listSuggestion, foreign_key:"id"
      t.string :suggestId

      #Id of the plant 
      t.string :plantId

      #Slug name of the plant
      t.string :plantSlug

      #Quantity that can be planted
      t.integer :quantity

      #Slug name of the plant that is planted where the suggestion comes from
      t.string :becauseOf
     end
  end
end
