const bookshelf = require("./config/bookshelf");
const utils = require("./config/utils");
const {
  ACADEMIC_YEARS,
  COUNTRIES,
  STREAMS,
  ALLOWED_MEDHA_ADMIN_ROUTES,
  ROLES,
  PUBLIC_ROUTES
} = require("./data");

(async () => {
  await academicYears();
  console.log("\n");
  await zones();
  console.log("\n");
  await rpcs();
  console.log("\n");
  await streams();
  console.log("\n");
  await addRolesAndPermissions();
  console.log("\n");
  await addCustomMedhaAdminPermission();
  console.log("\n");
  await addPublicRoutes();
})();

const fs = require("fs");

const apiFolder = "./api/";
const pluginFolder = "./plugins/crm-plugin";
const extendedPluginFolder = "./extensions/crm-plugin/config/routes.json";

// Project specific models APIs, controllers and action
let apiControllerActions = fs
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

apiControllerActions = Object.assign(apiControllerActions, {
  user: {
    find: { enabled: false },
    count: { enabled: false },
    findone: { enabled: false },
    create: { enabled: false },
    update: { enabled: false },
    destroy: { enabled: false },
    me: { enabled: false }
  }
});

// Plugins models APIs, controllers and action
const pluginControllerActionsRoutes = JSON.parse(
  fs.readFileSync(`${pluginFolder}/config/routes.json`)
);

let pluginControllerActions = pluginControllerActionsRoutes.routes.reduce(
  (result, r) => {
    const controller = r.handler.split(".")[0].toLowerCase();
    const action = r.handler.split(".")[1].toLowerCase();
    if (controller !== "crmplugin") {
      result[controller] = result[controller] || {};
      result[controller][action] = { enabled: false };
    }
    return result;
  },
  {}
);

// Extended plugin APIs, controllers and action
let extendPluginControllerAction = {};
try {
  if (fs.existsSync(extendedPluginFolder)) {
    const extendPluginControllerActionsRoutes = JSON.parse(
      fs.readFileSync(extendedPluginFolder)
    );

    extendPluginControllerAction = extendPluginControllerActionsRoutes.routes.reduce(
      (result, r) => {
        const controller = r.handler.split(".")[0].toLowerCase();
        const action = r.handler.split(".")[1].toLowerCase();
        result[controller] = result[controller] || {};
        result[controller][action] = { enabled: false };
        return result;
      },
      {}
    );
  }
} catch (error) {
  console.log(error);
}

let allAPIsControllerActions = Object.assign({}, apiControllerActions);
allAPIsControllerActions = Object.assign(
  apiControllerActions,
  pluginControllerActions
);
allAPIsControllerActions = Object.assign(
  apiControllerActions,
  extendPluginControllerAction
);

const rolesAndPermissions = Object.keys(ROLES).map(r => {
  const { controllers, grantAllPermissions } = ROLES[r];
  const updatedController = controllers.reduce((result, controller) => {
    const { name, action, type } = controller;

    const controllerType = type ? type : "application";

    result[controllerType] = result[controllerType] || {
      controllers: {}
    };

    if (grantAllPermissions) {
      const controllerWithAction = allAPIsControllerActions[name];
      const updatedActions = Object.keys(controllerWithAction).reduce(
        (acc, a) => {
          acc[a] = { enabled: true };
          return acc;
        },
        {}
      );
      result[controllerType]["controllers"][name] = updatedActions;
    } else {
      const controllerWithAction = allAPIsControllerActions[name];
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
      result[controllerType]["controllers"][name] = updatedActions;
    }
    return result;
  }, {});
  return {
    name: r,
    description: r,
    permissions: updatedController
  };
});

async function academicYears() {
  await utils.asyncForEach(ACADEMIC_YEARS, async ay => {
    const isAYPresent = await bookshelf
      .model("academic_year")
      .where({ name: ay.name })
      .fetch();

    if (isAYPresent) {
      console.log(`Skipping Academic Year ${ay.name}...`);
    } else {
      await bookshelf
        .model("academic_year")
        .forge({
          name: ay.name,
          start_date: ay.start_date,
          end_date: ay.end_date
        })
        .save()
        .then(() => {
          console.log(`Added Academic Year ${ay.name}`);
        });
    }
  });
}

async function zones() {
  console.log("Zones");
  await utils.asyncForEach(COUNTRIES, async c => {
    const { states } = c;
    const isCountryPresent = await bookshelf
      .model("country")
      .where({ name: c.name })
      .fetch();

    if (isCountryPresent) {
      await utils.asyncForEach(states, async s => {
        const { zones } = s;
        const isStatePresent = await bookshelf
          .model("state")
          .where({ name: s.name })
          .fetch();

        if (isStatePresent) {
          const state = isStatePresent.toJSON
            ? isStatePresent.toJSON()
            : isStatePresent;

          // Zones

          await utils.asyncForEach(zones, async zone => {
            const isZonePresent = await bookshelf
              .model("zone")
              .where({ name: zone.name, state: state.id })
              .fetch();

            if (isZonePresent) {
              console.log(`Skipping Zone ${zone.name}...`);
            } else {
              await bookshelf
                .model("zone")
                .forge({
                  name: zone.name,
                  state: state.id
                })
                .save()
                .then(() => {
                  console.log(`Added Zone ${zone.name} to ${state.name}`);
                });
            }
          });
        }
      });
    }
  });
}

async function rpcs() {
  console.log("RPCs");
  await utils.asyncForEach(COUNTRIES, async c => {
    const { states } = c;
    const isCountryPresent = await bookshelf
      .model("country")
      .where({ name: c.name })
      .fetch();

    if (isCountryPresent) {
      await utils.asyncForEach(states, async s => {
        const { rpcs } = s;
        const isStatePresent = await bookshelf
          .model("state")
          .where({ name: s.name })
          .fetch();

        if (isStatePresent) {
          const state = isStatePresent.toJSON
            ? isStatePresent.toJSON()
            : isStatePresent;

          // RPCs

          await utils.asyncForEach(rpcs, async rpc => {
            const isRPCPresent = await bookshelf
              .model("rpc")
              .where({ name: rpc.name, state: state.id })
              .fetch();

            if (isRPCPresent) {
              console.log(`Skipping RPC ${rpc.name}...`);
            } else {
              await bookshelf
                .model("rpc")
                .forge({
                  name: rpc.name,
                  state: state.id
                })
                .save()
                .then(() => {
                  console.log(`Added RPC ${rpc.name} to ${state.name}`);
                });
            }
          });
        }
      });
    }
  });
}

async function streams() {
  await utils.asyncForEach(STREAMS, async stream => {
    const isStreamPresent = await bookshelf
      .model("stream")
      .where({ name: stream })
      .fetch();

    if (isStreamPresent) {
      console.log(`Skipping Stream ${stream}...`);
    } else {
      await bookshelf
        .model("stream")
        .forge({
          name: stream
        })
        .save()
        .then(() => {
          console.log(`Added Stream ${stream}`);
        });
    }
  });
}

async function getMedhaAdminRole() {
  return await bookshelf
    .model("role")
    .where({
      name: "Medha Admin"
    })
    .fetch()
    .then(model => model.toJSON());
}

async function destroyAllUserPermissionsForMedhaAdmin(role) {
  try {
    return await bookshelf
      .model("permission")
      .where({
        controller: "userspermissions",
        type: "users-permissions",
        role: role
      })
      .destroy()
      .then(() => {
        console.log(
          "\nRemoving all custom user permissions for medha admin role"
        );
      });
  } catch (error) {
    console.log("\nNo custom user permissions found for medha admin role");
  }
}

async function addCustomMedhaAdminPermission() {
  const medhaAdmin = await getMedhaAdminRole();
  await destroyAllUserPermissionsForMedhaAdmin(medhaAdmin.id);

  await utils.asyncForEach(ALLOWED_MEDHA_ADMIN_ROUTES, async action => {
    await bookshelf
      .model("permission")
      .where({
        type: "users-permissions",
        controller: "userspermissions",
        action: action,
        role: medhaAdmin.id
      })
      .fetch()
      .then(res => {
        if (!res) {
          bookshelf
            .model("permission")
            .forge({
              type: "users-permissions",
              controller: "userspermissions",
              action: action,
              role: medhaAdmin.id,
              enabled: true
            })
            .save()
            .then(() => {
              console.log(`${action} permission added to Medha Admin`);
            });
        }
      });
  });
}

async function addRolesAndPermissions() {
  await utils.asyncForEach(rolesAndPermissions, async role => {
    const response = await bookshelf
      .model("role")
      .fetchAll()
      .then(model => model.toJSON());
    if (response.length) {
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
        await bookshelf
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
    }
  });
}

async function addPermissionsToGivenRole(role, id) {
  /**
   * Creating permissions WRT to controllers and mapping to created role
   */
  await utils.asyncForEach(Object.keys(role.permissions || {}), async type => {
    await utils.asyncForEach(
      Object.keys(role.permissions[type].controllers),
      async controller => {
        console.log(
          `Adding permission for ${controller} for role ${role.name}`
        );

        await utils.asyncForEach(
          Object.keys(role.permissions[type].controllers[controller]),
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
      }
    );
    console.log("\n");
  });
}

async function getPublicRole() {
  return await bookshelf
    .model("role")
    .where({ name: "Public" })
    .fetch()
    .then(res => res.toJSON());
}

async function deleteAllPublicRoute(role) {
  await bookshelf
    .model("permission")
    .where({
      role: role.id,
      type: "application"
    })
    .destroy({ require: false })
    .then(() => {
      console.log("\nDeleting all public routes...");
    });

  await bookshelf
    .model("permission")
    .where({
      role: role.id,
      type: "crm-plugin"
    })
    .destroy({ require: false })
    .then(() => {
      console.log("\nDeleting all CRM public routes...");
    });
}

async function addPublicRoutes() {
  const role = await getPublicRole();
  await deleteAllPublicRoute(role);

  const publicApplicationRoutes = PUBLIC_ROUTES.controllers.filter(
    controller => !controller.type
  );
  const publicCRMPluginRoutes = PUBLIC_ROUTES.controllers.filter(
    controller => controller.type
  );

  await utils.asyncForEach(publicApplicationRoutes, async controller => {
    const { action, name } = controller;
    await utils.asyncForEach(action, async act => {
      await bookshelf
        .model("permission")
        .forge({
          role: role.id,
          type: "application",
          controller: name,
          action: act,
          enabled: true
        })
        .save()
        .then(() => {
          console.log(`Added ${act} to controller ${name}`);
        });
    });
  });

  console.log("\n");

  await utils.asyncForEach(publicCRMPluginRoutes, async controller => {
    const { action, name, type } = controller;
    await utils.asyncForEach(action, async act => {
      await bookshelf
        .model("permission")
        .forge({
          role: role.id,
          type,
          controller: name,
          action: act,
          enabled: true
        })
        .save()
        .then(() => {
          console.log(`Added ${act} to controller ${name}`);
        });
    });
  });
}
