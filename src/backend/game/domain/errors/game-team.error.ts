export class InvalidGameTeamError extends Error {
  constructor(invalidPlayer: any) {
    super(`Invalid team on Game: ${invalidPlayer}`);
    this.name = "InvalidGameTeamError";
  }
}
