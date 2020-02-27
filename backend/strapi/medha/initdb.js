const fs = require("fs");
const bookshelf = require("./config/config.js");
const apiFolder = "./api/";
const _data = require("./data.js");
const minimist = require("minimist");
const args = minimist(process.argv.slice(2), {
  "--": true
});
const _skip = args["--"].length > 0;
const skip = new RegExp(args["--"].join("|"), "i");
let controllerActionWithoutUser = fs
  .readdirSync(apiFolder, { withFileTypes: true })
  .filter(api => api.isDirectory())
  .reduce((acc, folder) => {
    const { name } = folder;
    const raw = fs.readFileSync(`./api/${name}/config/routes.json`);
    const route = JSON.parse(raw);
    const actionObj = route.routes.reduce((result, r) => {
      const action = r.handler.split(".")[1].toLowerCase();
      result[action] = { enabled: false };
      return result;
    }, {});
    acc[name] = actionObj;
    return acc;
  }, {});
const allControllerActions = Object.assign(controllerActionWithoutUser, {
  user: {
    find: { enabled: false },
    count: { enabled: false },
    findone: { enabled: false },
    create: { enabled: false },
    update: { enabled: false },
    delete: { enabled: false },
    me: { enabled: false }
  }
});
const roles = _data.roles;
const _roleRequestData = Object.keys(roles).map(r => {
  const { controllers, grantAllPermissions } = roles[r];
  const updatedController = controllers.reduce((result, controller) => {
    const { name, action } = controller;
    if (grantAllPermissions) {
      const controllerWithAction = allControllerActions[name];
      const updatedActions = Object.keys(controllerWithAction).reduce(
        (acc, a) => {
          acc[a] = { enabled: true };
          return acc;
        },
        {}
      );
      result[name] = updatedActions;
      return result;
    } else {
      const controllerWithAction = allControllerActions[name];
      let updatedActions;
      if (action.length) {
        const regex = new RegExp(action.join("|"), "i");
        updatedActions = Object.keys(controllerWithAction).reduce((acc, a) => {
          acc[a] = { enabled: regex.test(a) };
          return acc;
        }, {});
      } else {
        updatedActions = Object.keys(controllerWithAction).reduce((acc, a) => {
          acc[a] = { enabled: false };
          return acc;
        }, {});
      }
      result[name] = updatedActions;
      return result;
    }
  }, {});
  return {
    name: r,
    description: r,
    permissions: {
      application: {
        controllers: updatedController
      }
    }
  };
});
function addPermissionsToGivenRole(role, id) {
  /**
   * Creating permissions WRT to controllers and mapping to created role
   */
  Object.keys(role.permissions || {}).forEach(type => {
    Object.keys(role.permissions[type].controllers).forEach(controller => {
      console.log(`Adding permission for ${controller} for role ${role.name}`);
      Object.keys(role.permissions[type].controllers[controller]).forEach(
        action => {
          bookshelf
            .model("permission")
            .forge({
              role: id,
              type: controller === "user" ? "users-permissions" : type,
              controller: controller,
              action: action.toLowerCase(),
              ...role.permissions[type].controllers[controller][action]
            })
            .save();
        }
      );
    });
    console.log("\n");
  });
}
/**
 * If args presents roles then skip role creation
 */
if (!(_skip && skip.test("roles"))) {
  _roleRequestData.forEach(role => {
    bookshelf
      .model("role")
      .fetchAll()
      .then(model => {
        const response = model.toJSON();
        const isRolePresent = response.find(r => r.name === role.name);
        if (isRolePresent) {
          bookshelf
            .model("permission")
            .where({ role: isRolePresent.id })
            .destroy()
            .then(() => {
              console.log(
                `Deleting existing permissions for role ${isRolePresent.name}\nAdding new permissions\n`
              );
              addPermissionsToGivenRole(role, isRolePresent.id);
            });
        } else {
          // Creating role
          bookshelf
            .model("role")
            .forge({
              name: role.name,
              description: role.description,
              type: role.name
            })
            .save()
            .then(r => {
              const _role = r.toJSON();
              addPermissionsToGivenRole(role, _role.id);
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(failed => {
        console.log({ failed });
      });
  });
}
/**
 * If args presents states then skip state creation
 */
if (!(_skip && skip.test("states"))) {
  const states = _data.states;
  const _stateRequestData = Object.keys(states).map(state => {
    const { zones, districts } = states[state];
    // Create Zone request data
    const _zoneRequestData = Object.keys(zones).map(zone => {
      const { rpcs } = zones[zone];
      return {
        name: zone,
        rpcs: rpcs.map(rpc => {
          return { name: rpc };
        })
      };
    });
    return {
      name: state,
      districts: districts,
      zones: _zoneRequestData
    };
  });
  /**
   * Creating all states
   */
  async function allStates() {
    return await bookshelf
      .model("state")
      .fetchAll()
      .then(res => res.toJSON());
  }
  async function allZones() {
    return await bookshelf
      .model("zone")
      .fetchAll()
      .then(res => res.toJSON());
  }
  async function allRPCs() {
    return await bookshelf
      .model("rpc")
      .fetchAll()
      .then(res => res.toJSON());
  }
  async function allDistricts() {
    return await bookshelf
      .model("district")
      .fetchAll()
      .then(res => res.toJSON());
  }
  (async () => {
    var _allState = await allStates();
    var _allZones = await allZones();
    var _allRPCs = await allRPCs();
    var _allDistricts = await allDistricts();
    _stateRequestData.forEach(state => {
      const isStateNew = _allState.find(
        d => d.name.toLowerCase() === state.name.toLowerCase()
      );
      if (!isStateNew) {
        bookshelf
          .model("state")
          .forge({
            name: state.name
          })
          .save()
          .then(() => {
            console.log(`Added state ${state.name}`);
          });
      } else {
        console.log(`Skipping state ${state.name}...`);
      }
    });
    _stateRequestData.forEach(state => {
      const { zones } = state;
      zones.forEach(zone => {
        const isZoneNew = _allZones.find(
          z => z.name.toLowerCase() === zone.name.toLowerCase()
        );
        if (!isZoneNew) {
          bookshelf
            .model("zone")
            .forge({
              name: zone.name
            })
            .save()
            .then(() => {
              console.log(`Added zone ${zone.name}`);
            });
        } else {
          console.log(`Skipping zone ${zone.name}...`);
        }
      });
    });
    _stateRequestData.forEach(state => {
      const { districts } = state;
      districts.forEach(district => {
        const isDistrictNew = _allDistricts.find(
          d => d.name.toLowerCase() === district.toLowerCase()
        );
        if (!isDistrictNew) {
          bookshelf
            .model("district")
            .forge({
              name: district
            })
            .save()
            .then(() => {
              console.log(`Added district ${district}`);
            });
        } else {
          console.log(`Skipping district ${district}...`);
        }
      });
    });
    _stateRequestData.forEach(state => {
      const { zones } = state;
      zones.forEach(zone => {
        const { rpcs } = zone;
        rpcs.forEach(rpc => {
          const isRPCnew = _allRPCs.find(
            z => z.name.toLowerCase() === rpc.name.toLowerCase()
          );
          if (!isRPCnew) {
            bookshelf
              .model("rpc")
              .forge({
                name: rpc.name
              })
              .save()
              .then(() => {
                console.log(`Added RPC ${rpc.name}`);
              });
          } else {
            console.log(`Skipping RPC ${rpc.name}...`);
          }
        });
      });
    });
    _allState = await allStates();
    _allZones = await allZones();
    _allRPCs = await allRPCs();
    _allDistricts = await allDistricts();
    /**
     * Mapping zone to state and rpc to zone
     */
    _stateRequestData.forEach(state => {
      const { zones, districts } = state;
      const _state = _allState.find(
        s => s.name.toLowerCase() === state.name.toLowerCase()
      );
      zones.forEach(zone => {
        const _zone = _allZones.find(
          z => z.name.toLowerCase() === zone.name.toLowerCase()
        );
        bookshelf
          .model("zone")
          .where({
            id: _zone.id
          })
          .save(
            {
              state: _state.id
            },
            { patch: true }
          )
          .then(() => {
            console.log(`Mapped ${zone.name} to ${state.name}`);
            const { rpcs } = zone;
            rpcs.forEach(rpc => {
              const _rpc = _allRPCs.find(
                r => r.name.toLowerCase() === rpc.name.toLowerCase()
              );
              bookshelf
                .model("rpc")
                .where({
                  id: _rpc.id
                })
                .save(
                  {
                    zone: _zone.id
                  },
                  {
                    patch: true
                  }
                )
                .then(() => {
                  console.log(`Mapped ${rpc.name} to ${zone.name}`);
                });
            });
          });
      });
      districts.forEach(district => {
        const _district = _allDistricts.find(
          d => d.name.toLowerCase() === district.toLowerCase()
        );
        bookshelf
          .model("district")
          .where({
            id: _district.id
          })
          .save(
            {
              state: _state.id
            },
            { patch: true }
          )
          .then(() => {
            console.log(`Mapped district ${district} to ${state.name}`);
          });
      });
    });
  })();
}
