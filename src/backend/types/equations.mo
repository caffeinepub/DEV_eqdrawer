import Common "common";

module {
  public type EquationId = Common.EquationId;
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  /// Internal mutable representation stored in the canister
  public type EquationInternal = {
    id : EquationId;
    owner : UserId;
    var name : Text;
    var canvasData : Text; // JSON-serialized stroke data
    createdAt : Timestamp;
    var updatedAt : Timestamp;
  };

  /// Immutable shared type returned to callers
  public type Equation = {
    id : EquationId;
    owner : UserId;
    name : Text;
    canvasData : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type CreateEquationArgs = {
    name : Text;
    canvasData : Text;
  };

  public type UpdateEquationArgs = {
    id : EquationId;
    name : ?Text;
    canvasData : ?Text;
  };
};
