module Mutations
  class HstoreFilter < AdditionalFilter
    # At a minimum, expect the input to respond to these methods.
    HASHY_METHODS = [:[], :[]=, :map]
    def filter(input)
        not_hash = HASHY_METHODS
          .map{|x| input.respond_to?(x) }
          .uniq
          .include?(false)
        return [input, :not_hash] if not_hash
        output = input
          .map{|x| Pair.new(*x) }
          .inject({}) do |hash, pair|
            hash[pair.head.to_sym] = pair.tail.to_s
            hash
          end
        [output, nil]
    end
  end
end