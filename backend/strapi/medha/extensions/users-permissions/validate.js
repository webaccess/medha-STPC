const bookshelf = require("../../config/config.js");

const validateZonalAdminParams = params => {
  if (!params.state || !params.zone) {
    return {
      isError: true,
      error: "State and Zone is compulsory, when user is Zonal Admin"
    };
  }
  return { isError: false, error: "" };
};

const validateRPCAdminParams = params => {
  if (!params.state || !params.zone || !params.rpc) {
    return {
      isError: true,
      error: "State, Zone and RPC is compulsory, when user is RPC Admin"
    };
  }
  return { isError: false, error: "" };
};

const validateCollegeAdminParams = params => {
  if (!params.state || !params.zone || !params.rpc || !params.college) {
    return {
      isError: true,
      error: "State, Zone, RPC and College is compulsory for College admin"
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

  const role = await bookshelf
    .model("role")
    .where({ id: params.role })
    .fetch();

  if (!role) {
    return { isError: true, error: "Role is invalid" };
  }

  const data = role.toJSON();
  /**
   * Zonal Admin
   * Compulsory fields: role, state, zone
   */
  if (data.name === "Zonal Admin") {
    const { isError, error } = validateZonalAdminParams(params);
    if (isError) {
      return { isError, error };
    }

    const response = await bookshelf
      .model("zone")
      .where({ id: params.zone })
      .fetch();
    if (!response) {
      return { isError: true, error: "Invalid zone" };
    }
    const zone = response.toJSON();
    if (zone.state !== params.state) {
      return { isError: true, error: "Zone and state does not match" };
    }
  }

  /**
   * RPC Admin
   * Compulsory fields: role, state, zone, rpc
   */
  if (data.name === "RPC Admin") {
    const { isError, error } = validateRPCAdminParams(params);
    if (isError) {
      return { isError, error };
    }

    const rpcResponse = await bookshelf
      .model("rpc")
      .where({ id: params.rpc })
      .fetch();
    const zoneResponse = await bookshelf
      .model("zone")
      .where({ id: params.zone })
      .fetch();
    if (!rpcResponse || !zoneResponse) {
      return {
        isError: true,
        error: !rpcResponse ? "Invalid RPC" : "Invalid Zone"
      };
    }

    const rpc = rpcResponse.toJSON();
    const zone = zoneResponse.toJSON();
    if (zone.state !== params.state) {
      return { isError: true, error: "Zone associated state does not match" };
    }

    if (rpc.zone !== params.zone) {
      return { isError: true, error: "RPC associated zone does not match" };
    }
  }

  /**
   * College Admin
   * Compulsory fields: role, state, zone, rpc, college
   */
  if (data.name === "College Admin") {
    const { isError, error } = validateCollegeAdminParams(params);
    if (isError) {
      return { isError, error };
    }

    const rpcResponse = await bookshelf
      .model("rpc")
      .where({ id: params.rpc })
      .fetch();
    const zoneResponse = await bookshelf
      .model("zone")
      .where({ id: params.zone })
      .fetch();
    const collegeResponse = await bookshelf
      .model("college")
      .where({ id: params.college })
      .fetch();

    if (!rpcResponse) {
      return { isError: true, error: "Invalid RPC" };
    }
    if (!zoneResponse) {
      return { isError: true, error: "Invalid Zone" };
    }
    if (!collegeResponse) {
      return { isError: true, error: "Invalid College" };
    }
    const rpc = rpcResponse.toJSON();
    const zone = zoneResponse.toJSON();
    const college = collegeResponse.toJSON();

    if (zone.state !== params.state) {
      return { isError: true, error: "Zone associated state does not match" };
    }

    if (rpc.zone !== params.zone) {
      return { isError: true, error: "RPC associated zone does not match" };
    }

    if (college.rpc !== params.rpc) {
      return {
        isError: true,
        error: "College associated with rpc does not match"
      };
    }
  }

  /**
   * Student role
   * Compulsory fields: role, state, zone, rpc, college
   */
  if (data.name === "Authenticated") {
    const { isError, error } = validateStudentParams(params);
    if (isError) {
      return { isError, error };
    }

    const rpcResponse = await bookshelf
      .model("rpc")
      .where({ id: params.rpc })
      .fetch();
    const zoneResponse = await bookshelf
      .model("zone")
      .where({ id: params.zone })
      .fetch();
    const collegeResponse = await bookshelf
      .model("college")
      .where({ id: params.college })
      .fetch();

    if (!rpcResponse) {
      return { isError: true, error: "Invalid RPC" };
    }
    if (!zoneResponse) {
      return { isError: true, error: "Invalid Zone" };
    }
    if (!collegeResponse) {
      return { isError: true, error: "Invalid College" };
    }
    const rpc = rpcResponse.toJSON();
    const zone = zoneResponse.toJSON();
    const college = collegeResponse.toJSON();

    if (zone.state !== params.state) {
      return { isError: true, error: "Zone associated state does not match" };
    }

    if (rpc.zone !== params.zone) {
      return { isError: true, error: "RPC associated zone does not match" };
    }

    if (college.rpc !== params.rpc) {
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
