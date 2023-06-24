import { Tenant, TenantId, TenantProps } from "./tenant";

describe("Tenant Unit Test", () => {
  const tester = {
    props: {
      name: "Tenant 1",
    },
  };

  beforeEach(() => {
    Tenant.validate = jest.fn();
  });
  test("constructor of Tenant", () => {
    let tenant = new Tenant(tester.props);
    let props = tenant.props;
    expect(Tenant.validate).toHaveBeenCalled();
    expect(props).toStrictEqual(tester.props);
  });

  describe("id prop", () => {
    const props: TenantProps = tester.props;

    const arrange = [
      { props },
      { props, id: null as any },
      { props, id: undefined },
      { props, id: new TenantId() },
    ];
    test.each(arrange)("%#) when props are %j", (item) => {
      const tenant = new Tenant(item.props, item.id as any);
      expect(tenant.id).not.toBeNull();
      expect(tenant.entityId).toBeInstanceOf(TenantId);
    });
  });

  test("getter and setter of name prop", () => {
    const tenant = new Tenant(tester.props);
    tenant["name"] = "other name";
    expect(tenant.name).toBe("other name");
  });

  it("should update a tenant", () => {
    const tenant = new Tenant(tester.props);

    tenant.update("Tenant 2");
    expect(Tenant.validate).toHaveBeenCalledTimes(2);
    expect(tenant.name).toBe("Tenant 2");
    expect(tenant.props).toStrictEqual({
      ...tester.props,
      name: "Tenant 2",
    });
  });

  it("should converte to JSON", () => {
    const tenant = new Tenant(tester.props);

    expect(tenant.toJSON()).toEqual({
      id: tenant.id,
      name: tenant.name,
    });
  });
});
