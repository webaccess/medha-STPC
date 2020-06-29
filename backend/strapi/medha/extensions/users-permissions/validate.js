const validateZonalAdminParams = params => {
  if (!params.zone) {
    return {
      isError: true,
      error: "Zone is compulsory, when user is Zonal Admin"
    };
  }
  return { isError: false, error: "" };
};

const validateRPCAdminParams = params => {
  if (!params.rpc) {
    return {
      isError: true,
      error: "RPC is compulsory, when user is RPC Admin"
    };
  }
  return { isError: false, error: "" };
};

const validateCollegeAdminParams = params => {
  if (!params.college) {
    return {
      isError: true,
      error: "College is compulsory for College admin"
    };
  }
  return { isError: false, error: "" };
};

const validateStudentParams = params => {
  if (!params.state || !params.zone || !params.rpc || !params.college) {
    return {
      isError: true,
      error: "State, Zone, RPC and College is compulsory for Student user"
    };
  }
  return { isError: false, error: "" };
};

async function validate(params) {
  if (!params.role) {
    return { isError: true, error: "Role is compulsory" };
  }

  const role = await strapi
    .query("role", "users-permissions")
    .findOne({ id: params.role }, []);

  if (!role) {
    return { isError: true, error: "Role is invalid" };
  }

  /**
   * Zonal Admin
   * Compulsory fields: role, zone
   */
  if (role.name === "Zonal Admin") {
    const { isError, error } = validateZonalAdminParams(params);
    if (isError) {
      return { isError, error };
    }

    const zone = await strapi.query("zone").findOne({ id: params.zone });
    if (!zone) {
      return { isError: true, error: "Invalid zone" };
    }
    if (params.state && params.state !== zone.state.id) {
      return { isError: true, error: "Zone and state does not match" };
    }
  }

  /**
   * RPC Admin
   * Compulsory fields: role, rpc
   */
  if (role.name === "RPC Admin") {
    const { isError, error } = validateRPCAdminParams(params);
    if (isError) {
      return { isError, error };
    }

    const rpc = await strapi.query("rpc").findOne({ id: params.rpc });

    let zone;
    if (params.zone) {
      zone = await strapi.query("zone").findOne({ id: params.zone });
    }

    if (params.zone && !zone) {
      return {
        isError: true,
        error: "Invalid Zone"
      };
    }

    if (!rpc) {
      return {
        isError: true,
        error: "Invalid RPC"
      };
    }

    if (params.zone && params.state && params.state !== zone.state.id) {
      return { isError: true, error: "Zone associated state does not match" };
    }
  }

  /**
   * College Admin
   * Compulsory fields: role, college
   */
  if (role.name === "College Admin") {
    const { isError, error } = validateCollegeAdminParams(params);
    if (isError) {
      return { isError, error };
    }

    let zone, rpc, college, state;
    rpc = await strapi.query("rpc").findOne({ id: params.rpc });
    zone = await strapi.query("zone").findOne({ id: params.zone });
    state = await strapi.query("state").findOne({ id: params.state });
    college = await strapi.query("college").findOne({ id: params.college });

    if (params.state && !state) {
      return { isError: true, error: "Invalid State" };
    }

    if (params.zone && !zone) {
      return { isError: true, error: "Invalid Zone" };
    }

    if (params.rpc && !rpc) {
      return { isError: true, error: "Invalid RPCzone" };
    }

    if (!college) {
      return { isError: true, error: "Invalid College" };
    }

    console.log(state);
    console.log(zone);
    if (
      params.zone &&
      params.state &&
      state &&
      zone &&
      state.id !== zone.state.id
    ) {
      return { isError: true, error: "Zone associated state does not match.." };
    }

    if (params.rpc && params.rpc !== college.rpc.id) {
      return {
        isError: true,
        error: "College associated with rpc does not match"
      };
    }
  }

  // TODO add new role Student
  /**
   * Student role
   * Compulsory fields: role, state, zone, rpc, college
   */
  if (role.name === "Authenticated") {
    const { isError, error } = validateStudentParams(params);
    if (isError) {
      return { isError, error };
    }

    const rpc = await strapi.query("rpc").findOne({ id: params.rpc });
    const zone = await strapi.query("zone").findOne({ id: params.zone });
    const college = await strapi
      .query("college")
      .findOne({ id: params.college });
    const state = await strapi.query("state").findOne({ id: params.state });

    if (!state) {
      return { isError: true, error: "Invalid State" };
    }
    if (!zone) {
      return { isError: true, error: "Invalid Zone" };
    }
    if (!rpc) {
      return { isError: true, error: "Invalid RPC" };
    }
    if (!college) {
      return { isError: true, error: "Invalid College" };
    }

    if (zone.state.id !== state.id) {
      return { isError: true, error: "Zone associated state does not match" };
    }

    if (college.rpc.id !== rpc.id) {
      return {
        isError: true,
        error: "College associated with rpc does not match"
      };
    }
  }

  return { isError: false, error: "" };
}

module.exports = {
  validate
};
