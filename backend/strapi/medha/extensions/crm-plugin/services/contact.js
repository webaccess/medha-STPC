"use strict";

const utils = require("../../../config/utils");
const bookshelf = require("../../../config/bookshelf");
const { PLUGIN } = require("../../../config/constants");
const { buildQuery } = require("strapi-utils");
module.exports = {
  getEvents: async (contact, events) => {
    const filtered = events.filter(event => {
      const { contacts, rpc, zone, state } = event;

      /**
       * Since colleges might be empty array
       * If Event has particular colleges then filter by colleges
       * If Event has RPC and Zone then get student college's RPC and Zone
       * If Event has either RPC or Zone then get student college's RPC or Zone
       *
       *
       * TODO:
       * Since college don't have state attribute in their schema we need to filter state either
       * from RPC or Zone
       * Currently we only have one state so we are returning event directly
       * since it won't affect response
       * But when we have case where we have more than 1 state then in that case we'll filter
       * state either from rpc or zone from college
       */

      const isCollegesExist = contacts.length > 0 ? true : false;
      const isRPCExist = rpc && Object.keys(rpc).length > 0 ? true : false;
      const isZoneExist = zone && Object.keys(zone).length > 0 ? true : false;
      const isStateExist =
        state && Object.keys(state).length > 0 ? true : false;

      if (isRPCExist && isZoneExist && !isCollegesExist) {
        if (
          rpc.id == contact.organization.rpc &&
          zone.id == contact.organization.zone
        )
          return event;
      } else if (isRPCExist && !isCollegesExist) {
        if (rpc.id == contact.organization.rpc) return event;
      } else if (isZoneExist && !isCollegesExist) {
        if (zone.id == contact.organization.zone) return event;
      } else if (isCollegesExist) {
        const isExist = contacts.filter(c => c.id == contact.id);
        if (isExist && isExist.length > 0) return event;
      } else {
        return event;
      }
    });

    return filtered;
  },

  getEventsForRpc: async (contact, events) => {
    const filtered = events.filter(event => {
      const { contacts, rpc, zone, state } = event;
      const isCollegesExist = contacts.length > 0 ? true : false;
      const isRPCExist = rpc && Object.keys(rpc).length > 0 ? true : false;
      const isZoneExist = zone && Object.keys(zone).length > 0 ? true : false;
      const isStateExist =
        state && Object.keys(state).length > 0 ? true : false;

      if (isStateExist && !isRPCExist && !isZoneExist && !isCollegesExist) {
        if (state.id == contact.state) return event;
      } else if (isRPCExist) {
        if (rpc.id == contact.id) return event;
      } else if (!isRPCExist && isZoneExist) {
        return null;
      } else {
        return event;
      }
    });

    return filtered;
  },

  getEventsForZone: async (contact, events) => {
    const filtered = events.filter(event => {
      const { contacts, rpc, zone, state } = event;
      const isCollegesExist = contacts.length > 0 ? true : false;
      const isRPCExist = rpc && Object.keys(rpc).length > 0 ? true : false;
      const isZoneExist = zone && Object.keys(zone).length > 0 ? true : false;
      const isStateExist =
        state && Object.keys(state).length > 0 ? true : false;

      if (isStateExist && !isRPCExist && !isZoneExist && !isCollegesExist) {
        if (state.id == contact.state) return event;
      } else if (isZoneExist) {
        if (zone.id == contact.id) return event;
      } else if (!isZoneExist && isRPCExist) {
        return null;
      } else {
        return event;
      }
    });

    return filtered;
  },

  /**
   * @return {Array}
   * @param {CollegeId}
   *
   * Get all student for given college id
   */
  getUsers: async collegeId => {
    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Student" });

    const options = {
      withRelated: [
        "contact",
        "contact.individual",
        "contact.individual.organization"
      ]
    };

    const filters = {
      start: 0,
      limit: -1,
      where: [
        {
          field: "contact.individual.organization.contact",
          operator: "eq",
          value: collegeId
        },
        { field: "role", operator: "eq", value: studentRole.id }
      ]
    };

    const response = await strapi
      .query("user", "users-permissions")
      .model.query(
        buildQuery({
          model: strapi.query("user", "users-permissions").model,
          filters
        })
      )
      .fetchAll(options)
      .then(model => model.toJSON());

    const userIds = response.map(user => user.id);
    return userIds;
  },

  /**
   * @return {Array}
   * @param {CollegeId}
   *
   * Get all student for given college id
   */
  getStudentsOfCollege: async collegeId => {
    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Student" });

    const response = await strapi
      .query("user", "users-permissions")
      .find({ role: studentRole.id }, [
        "contact",
        "contact.individual",
        "contact.individual.organization"
      ]);

    const userIds = response
      .filter(
        user =>
          user.contact.individual &&
          user.contact.individual.organization &&
          user.contact.individual.organization.contact == collegeId
      )
      .map(user => user.id);

    const contacts = await strapi
      .query("contact", "crm-plugin")
      .find({ user_in: userIds });

    const contactIds = contacts.map(contact => contact.id);
    return contactIds;
  },

  /**
   * @return {Array}
   * @param {CollegeId}
   *
   * Get all student for given college id
   */
  getCollegeAdminsFromCollege: async collegeId => {
    const collegeRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "College Admin" });

    const response = await strapi
      .query("user", "users-permissions")
      .find({ role: collegeRole.id }, [
        "contact",
        "contact.individual",
        "contact.individual.organization"
      ]);

    const userIds = response
      .filter(user => {
        console.log(user.contact.individual.organization, collegeId);
        return (
          user.contact.individual &&
          user.contact.individual.organization &&
          user.contact.individual.organization.contact == collegeId
        );
      })
      .map(user => user.id);

    const contacts = await strapi
      .query("contact", "crm-plugin")
      .find({ user_in: userIds });

    const contactIds = contacts.map(contact => contact.id);
    return contactIds;
  },

  /**
   * @return {Array}
   * @param {CollegeId}
   *
   * Get all rpcs
   */
  getAllRpcs: async () => {
    const rpcRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "RPC Admin" });

    const response = await strapi
      .query("user", "users-permissions")
      .find({ role: rpcRole.id }, [
        "contact",
        "contact.individual",
        "contact.individual.organization"
      ]);

    const userIds = response.map(user => user.id);

    let rpcAdmins = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: userIds });

    const rpcAdminIds = rpcAdmins.map(user => {
      return user.id;
    });

    return rpcAdminIds;
  },

  /**
   * @return {Array}
   * @param {CollegeId}
   *
   * Get all zones
   */
  getAllZones: async () => {
    const zoneRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Zonal Admin" });

    const response = await strapi
      .query("user", "users-permissions")
      .find({ role: zoneRole.id }, [
        "contact",
        "contact.individual",
        "contact.individual.organization"
      ]);

    const userIds = response.map(user => user.id);

    let zoneAdmins = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: userIds });

    const zoneAdminIds = zoneAdmins.map(user => {
      return user.id;
    });

    return zoneAdminIds;
  },

  /**
   * @return {Array}
   * @param {CollegeId}
   *
   * Get all college admins
   */
  getAllCollegeAdmins: async () => {
    const collegeRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "College Admin" });

    const response = await strapi
      .query("user", "users-permissions")
      .find({ role: collegeRole.id }, [
        "contact",
        "contact.individual",
        "contact.individual.organization"
      ]);

    const userIds = response.map(user => user.id);

    let collegeAdmins = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: userIds });

    const collegeAdminIds = collegeAdmins.map(user => {
      return user.id;
    });

    return collegeAdminIds;
  },

  /**
   * @return {Array}
   * @param {CollegeId}
   *
   * Get all college admin for given college id
   */
  getCollegeAdmin: async collegeId => {
    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "College Admin" });

    const response = await strapi
      .query("user", "users-permissions")
      .find({ role: studentRole.id }, [
        "contact",
        "contact.individual",
        "contact.individual.organization"
      ]);

    const userIds = response
      .filter(
        user =>
          user.contact.individual &&
          user.contact.individual.organization &&
          user.contact.individual.organization.contact == collegeId
      )
      .map(user => user.id);
    return userIds;
  },

  /**
   * @return {Array}
   * @param {CollegeId}
   *
   * Get all college admin for given college id
   */
  getRpcAdmins: async rpcId => {
    const rpcRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "RPC Admin" });

    const response = await strapi
      .query("user", "users-permissions")
      .find({ role: rpcRole.id }, [
        "contact",
        "contact.individual",
        "contact.individual.organization"
      ]);

    const userIds = response
      .filter(user => user.rpc == rpcId)
      .map(user => user.id);

    return userIds;
  },

  /**
   * @return {Array}
   * @param {CollegeId}
   *
   * Get all college admin for given college id
   */
  getZoneAdmins: async zoneId => {
    const zoneRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Zonal Admin" });

    const response = await strapi
      .query("user", "users-permissions")
      .find({ role: zoneRole.id }, [
        "contact",
        "contact.individual",
        "contact.individual.organization"
      ]);

    const userIds = response
      .filter(user => user.zone == zoneId)
      .map(user => user.id);

    let zonalAdminContacts = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: userIds });

    const zonalAdminIds = zonalAdminContacts.map(user => {
      return user.id;
    });

    return zonalAdminIds;
  },

  /**
   * @return {Array}
   * @param {CollegeId}
   *
   * Get all college admin for given rpc id
   */
  getCollegeAdminsFromRPC: async rpcId => {
    const collegeRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "College Admin" });

    const response = await strapi
      .query("user", "users-permissions")
      .find({ role: collegeRole.id }, [
        "contact",
        "contact.individual",
        "contact.individual.organization"
      ]);

    const userIds = response
      .filter(user => user.rpc == rpcId)
      .map(user => user.id);

    return userIds;
  },

  /**
   * @return {Array}
   * @param {CollegeId}
   *
   * Get all college admin for given zone id
   */
  getCollegeAdminsFromZone: async zoneId => {
    const collegeRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "College Admin" });

    const response = await strapi
      .query("user", "users-permissions")
      .find({ role: collegeRole.id }, [
        "contact",
        "contact.individual",
        "contact.individual.organization"
      ]);

    const userIds = response
      .filter(user => user.zone == zoneId)
      .map(user => user.id);

    let collegeAdminContacts = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: userIds });

    const collegeAdminContactIds = collegeAdminContacts.map(user => {
      return user.id;
    });

    return collegeAdminContactIds;
  },

  /**
   * @param {ids, block}
   * ids => which ids to block or unblock
   * block => flag to block or unblock user
   */
  blockUnblockUsers: async (ctx, block) => {
    const { ids } = ctx.request.body;

    if (!ids) {
      return ctx.response.badRequest("Missing ids field");
    }

    let idsToBlock;
    if (typeof ids === "number") {
      idsToBlock = [ids];
    }

    if (typeof ids === "object") {
      idsToBlock = ids;
    }

    if (!idsToBlock.length) {
      return ctx.response.badRequest("Individual Ids are empty");
    }

    const contacts = await Promise.all(
      idsToBlock.map(async id => {
        return strapi.query("contact", PLUGIN).findOne({ id });
      })
    );

    if (contacts.some(contact => contact == null)) {
      return ctx.response.badRequest("Invalid Contact Ids");
    }

    const userIds = contacts.map(
      contact => (contact.user && contact.user.id) || null
    );

    if (userIds.some(id => id == null)) {
      return ctx.response.badRequest("Invalid User Ids or User does not exist");
    }

    await strapi
      .query("user", "users-permissions")
      .model.query(qb => {
        qb.whereIn("id", userIds);
      })
      .save({ blocked: block }, { patch: true, require: false });

    return utils.getFindOneResponse({});
  },

  /**
   * Get user role from contact
   */
  getUserRole: async ctx => {
    return (ctx.state.user && ctx.state.user.role) || null;
  },

  /** Get contact ids for feedback */
  getContactIdsForFeedback: async (ctx, id, role, contactIdToFind) => {
    if (role === "Zonal Admin") {
      if (contactIdToFind === "college") {
        const collegeAdminIds = await strapi.plugins[
          "crm-plugin"
        ].services.contact.getCollegeAdminsFromZone(id);

        return collegeAdminIds;
      } else if (contactIdToFind === "rpc") {
        const rpcAdmins = await strapi.plugins[
          "crm-plugin"
        ].services.contact.getAllCollegeAdmins();

        return rpcAdmins;
      }
    } else if (role === "Medha Admin") {
      if (contactIdToFind === "college") {
        const collegeAdminIds = await strapi.plugins[
          "crm-plugin"
        ].services.contact.getAllCollegeAdmins();

        return collegeAdminIds;
      } else if (contactIdToFind === "rpc") {
        const rpcAdmins = await strapi.plugins[
          "crm-plugin"
        ].services.contact.getAllCollegeAdmins();

        return rpcAdmins;
      } else if (contactIdToFind === "zone") {
        const zoneAdmins = await strapi.plugins[
          "crm-plugin"
        ].services.contact.getAllZones();

        return zoneAdmins;
      }
    }
  },

  /**Delete references of file and delete file */
  deleteDocument: async (fileId, document) => {
    const config = await strapi
      .store({
        environment: strapi.config.environment,
        type: "plugin",
        name: "upload"
      })
      .get({ key: "provider" });

    const file = await strapi.plugins["upload"].services.upload.fetch({
      id: fileId
    });

    /**
     * Delete related document if present
     * Otherwise only delete uploaded file and it's references
     */

    if (document) {
      await strapi.query("document").delete({ id: document });
    }

    if (!file) {
      return ctx.notFound("file.notFound");
    }

    const related = await bookshelf
      .model("uploadMorph")
      .where({ upload_file_id: fileId })
      .fetch();

    if (related) {
      await related.destroy();
    }

    await strapi.plugins["upload"].services.upload.remove(file, config);
    return file;
  },

  getCollegeContactIdUsingCollegeAdminContactId: async contactId => {
    const response = await strapi
      .query("contact", "crm-plugin")
      .find({ id: contactId }, ["individual", "individual.organization"]);

    return response[0].individual.organization.contact;
  }
};
