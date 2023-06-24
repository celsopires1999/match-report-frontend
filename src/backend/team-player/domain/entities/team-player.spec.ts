import { PlayerId } from "@/backend/player/domain/entities/player";
import { TeamId } from "@/backend/team/domain/entities/team";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { TeamPlayer, TeamPlayerId, TeamPlayerProps } from "./team-player";

describe("TeamPlayer Unit Test", () => {
  const tester = {
    props: {
      tenant_id: new TenantId(),
      team_id: new TeamId(),
      player_id: new PlayerId(),
    },
  };

  beforeEach(() => {
    TeamPlayer.validate = jest.fn();
  });
  test("constructor of TeamPlayer", () => {
    let team = new TeamPlayer(tester.props);
    let props = team.props;
    expect(TeamPlayer.validate).toHaveBeenCalled();
    expect(props).toStrictEqual(tester.props);
  });

  describe("id prop", () => {
    const props: TeamPlayerProps = tester.props;

    const arrange = [
      { props },
      { props, id: null as any },
      { props, id: undefined },
      { props, id: new TeamPlayerId() },
    ];
    test.each(arrange)("%#) when props are %j", (item) => {
      const team = new TeamPlayer(item.props, item.id as any);
      expect(team.id).not.toBeNull();
      expect(team.entityId).toBeInstanceOf(TeamPlayerId);
    });
  });

  test("getter and setter of tenant_id prop", () => {
    const teamPlayer = new TeamPlayer(tester.props);
    const tenant_id = new TenantId();
    teamPlayer["tenant_id"] = tenant_id;
    expect(teamPlayer.tenant_id).toBe(tenant_id);
  });

  test("getter and setter of team_id prop", () => {
    const teamPlayer = new TeamPlayer(tester.props);
    const team_id = new TenantId();
    teamPlayer["team_id"] = team_id;
    expect(teamPlayer.team_id).toBe(team_id);
  });

  test("getter and setter of player_id prop", () => {
    const teamPlayer = new TeamPlayer(tester.props);
    const player_id = new TenantId();
    teamPlayer["player_id"] = player_id;
    expect(teamPlayer.player_id).toBe(player_id);
  });

  it("should converte to JSON", () => {
    const teamPlayer = new TeamPlayer(tester.props);

    expect(teamPlayer.toJSON()).toEqual({
      id: teamPlayer.id,
      tenant_id: teamPlayer.tenant_id.value,
      team_id: teamPlayer.team_id.value,
      player_id: teamPlayer.player_id.value,
    });
  });
});
