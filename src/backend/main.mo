import Map "mo:core/Map";
import List "mo:core/List";
import EquationsLib "lib/equations";
import EquationsApi "mixins/equations-api";
import Types "types/equations";

actor {
  let equationsState : EquationsLib.State = {
    equations = Map.empty<Principal, List.List<Types.EquationInternal>>();
    var nextId = 0;
  };

  include EquationsApi(equationsState);
};
