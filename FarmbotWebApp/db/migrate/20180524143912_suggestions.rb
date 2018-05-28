class Suggestions < ActiveRecord::Migration[5.1]
  def change
    create_table :suggestions do |t|
      #Id of the suggest
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
