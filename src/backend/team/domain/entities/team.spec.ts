import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { Team, TeamId, TeamProps } from "./team";

describe("Team Unit Test", () => {
  const tester = {
    props: {
      name: "Team 1",
      tenant_id: new TenantId(),
    },
  };

  beforeEach(() => {
    Team.validate = jest.fn();
  });
  test("constructor of Team", () => {
    let team = new Team(tester.props);
    let props = team.props;
    expect(Team.validate).toHaveBeenCalled();
    expect(props).toStrictEqual(tester.props);
  });

  describe("id prop", () => {
    const props: TeamProps = tester.props;

    const arrange = [
      { props },
      { props, id: null as any },
      { props, id: undefined },
      { props, id: new TeamId() },
    ];
    test.each(arrange)("%#) when props are %j", (item) => {
      const team = new Team(item.props, item.id as any);
      expect(team.id).not.toBeNull();
      expect(team.entityId).toBeInstanceOf(TeamId);
    });
  });

  test("getter and setter of name prop", () => {
    const team = new Team(tester.props);
    team["name"] = "other name";
    expect(team.name).toBe("other name");
  });

  it("should update a team", () => {
    const team = new Team(tester.props);

    team.update("Team 2");
    expect(Team.validate).toHaveBeenCalledTimes(2);
    expect(team.name).toBe("Team 2");
    expect(team.props).toStrictEqual({
      ...tester.props,
      name: "Team 2",
    });
  });

  it("should converte to JSON", () => {
    const team = new Team(tester.props);

    expect(team.toJSON()).toEqual({
      id: team.id,
      name: team.name,
      tenant_id: team.tenant_id.value,
    });
  });
});
