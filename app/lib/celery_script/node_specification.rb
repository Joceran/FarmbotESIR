# Describes the allowed arguments and body types of CeleryScript node.
# Eg: Which arguments does it take? Which nodes can be placed in the body field?
module CeleryScript
  class NodeSpecification
    NOOP      = ->(*_) { }

    attr_reader :name,
                :allowed_args,
                :allowed_body_types,
                :additional_validation

    def initialize(name, allowed_args, allowed_body_types, additional_validation = NOOP)
      @name                  = name
      @allowed_args          = allowed_args
      @allowed_body_types    = allowed_body_types
      @additional_validation = additional_validation
    end

    def as_json(*)
      {
        "allowed_args"       => allowed_args,
        "allowed_body_types" => allowed_body_types,
        "name"               => name,
      }
    end
  end
end
