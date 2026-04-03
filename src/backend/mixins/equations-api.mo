import Principal "mo:core/Principal";
import EquationsLib "../lib/equations";
import Types "../types/equations";
import Common "../types/common";

mixin (state : EquationsLib.State) {

  /// Create a new equation for the authenticated caller
  public shared ({ caller }) func createEquation(args : Types.CreateEquationArgs) : async Types.Equation {
    EquationsLib.createEquation(state, caller, args);
  };

  /// List all equations belonging to the authenticated caller
  public shared query ({ caller }) func listEquations() : async [Types.Equation] {
    EquationsLib.listEquations(state, caller);
  };

  /// Get a single equation by ID (only accessible by owner)
  public shared query ({ caller }) func getEquation(id : Common.EquationId) : async ?Types.Equation {
    EquationsLib.getEquation(state, caller, id);
  };

  /// Update an equation's name and/or canvas data
  public shared ({ caller }) func updateEquation(args : Types.UpdateEquationArgs) : async ?Types.Equation {
    EquationsLib.updateEquation(state, caller, args);
  };

  /// Delete an equation by ID
  public shared ({ caller }) func deleteEquation(id : Common.EquationId) : async Bool {
    EquationsLib.deleteEquation(state, caller, id);
  };
};
