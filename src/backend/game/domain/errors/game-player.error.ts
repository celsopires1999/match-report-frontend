export class InvalidGamePlayerError extends Error {
  constructor(invalidPlayer: any) {
    super(`Invalid player on Game: ${invalidPlayer}`);
    this.name = "InvalidGamePlayerError";
  }
}
