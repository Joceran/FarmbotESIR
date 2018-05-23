module Points
  class Create < Mutations::Command
    required do
      model  :device, class: Device
      float  :x
      float  :y
      float  :z
      float  :radius
      hstore :meta
    end

    optional do
      string :name
    end

    def execute
      Point.create!(inputs.merge(pointer: GenericPointer.new))
    end
  end
end
