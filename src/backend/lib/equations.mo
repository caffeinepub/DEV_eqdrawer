import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Types "../types/equations";
import Common "../types/common";

module {
  public type State = {
    equations : Map.Map<Common.UserId, List.List<Types.EquationInternal>>;
    var nextId : Common.EquationId;
  };

  public func newState() : State {
    {
      equations = Map.empty<Common.UserId, List.List<Types.EquationInternal>>();
      var nextId = 0;
    };
  };

  public func createEquation(
    state : State,
    owner : Common.UserId,
    args : Types.CreateEquationArgs,
  ) : Types.Equation {
    let id = state.nextId;
    state.nextId += 1;
    let now = Time.now();
    let eq : Types.EquationInternal = {
      id;
      owner;
      var name = args.name;
      var canvasData = args.canvasData;
      createdAt = now;
      var updatedAt = now;
    };
    let ownerList = switch (state.equations.get(owner)) {
      case (?list) list;
      case null {
        let fresh = List.empty<Types.EquationInternal>();
        state.equations.add(owner, fresh);
        fresh;
      };
    };
    ownerList.add(eq);
    toPublic(eq);
  };

  public func listEquations(
    state : State,
    owner : Common.UserId,
  ) : [Types.Equation] {
    switch (state.equations.get(owner)) {
      case null [];
      case (?list) list.map<Types.EquationInternal, Types.Equation>(toPublic).toArray();
    };
  };

  public func getEquation(
    state : State,
    owner : Common.UserId,
    id : Common.EquationId,
  ) : ?Types.Equation {
    switch (state.equations.get(owner)) {
      case null null;
      case (?list) {
        switch (list.find(func(eq : Types.EquationInternal) : Bool { eq.id == id and Principal.equal(eq.owner, owner) })) {
          case null null;
          case (?eq) ?toPublic(eq);
        };
      };
    };
  };

  public func updateEquation(
    state : State,
    owner : Common.UserId,
    args : Types.UpdateEquationArgs,
  ) : ?Types.Equation {
    switch (state.equations.get(owner)) {
      case null null;
      case (?list) {
        var found : ?Types.EquationInternal = null;
        list.mapInPlace(func(eq : Types.EquationInternal) : Types.EquationInternal {
          if (eq.id == args.id and Principal.equal(eq.owner, owner)) {
            switch (args.name) { case (?n) { eq.name := n }; case null {} };
            switch (args.canvasData) { case (?c) { eq.canvasData := c }; case null {} };
            eq.updatedAt := Time.now();
            found := ?eq;
          };
          eq;
        });
        switch (found) {
          case null null;
          case (?eq) ?toPublic(eq);
        };
      };
    };
  };

  public func deleteEquation(
    state : State,
    owner : Common.UserId,
    id : Common.EquationId,
  ) : Bool {
    switch (state.equations.get(owner)) {
      case null false;
      case (?list) {
        let before = list.size();
        let kept = list.filter(func(eq : Types.EquationInternal) : Bool {
          not (eq.id == id and Principal.equal(eq.owner, owner))
        });
        let after = kept.size();
        if (after < before) {
          // replace list contents: clear and re-add kept items
          list.clear();
          list.append(kept);
          true;
        } else {
          false;
        };
      };
    };
  };

  public func toPublic(eq : Types.EquationInternal) : Types.Equation {
    {
      id = eq.id;
      owner = eq.owner;
      name = eq.name;
      canvasData = eq.canvasData;
      createdAt = eq.createdAt;
      updatedAt = eq.updatedAt;
    };
  };
};
