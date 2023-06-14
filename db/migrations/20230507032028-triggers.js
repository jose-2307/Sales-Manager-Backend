'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.sequelize.query(
      'CREATE OR REPLACE FUNCTION defaulter_create()'+
      ' RETURNS TRIGGER'+
      ' Language plpgsql'+
      ' AS $$'+
      ' BEGIN'+
        ' INSERT INTO defaulters(user_id, customer_id) VALUES (NEW.user_id, NEW.id);'+
        ' RETURN new;'+
      ' END;'+
      ' $$');

    await queryInterface.sequelize.query(
      'CREATE TRIGGER trigger_defaulter_create '+
      'AFTER INSERT ON customers '+
      'FOR EACH ROW EXECUTE FUNCTION defaulter_create();'
    );
  },


  async down (queryInterface) {
    await queryInterface.sequelize.query("DROP TRIGGER trigger_defaulter_create ON customers;");
    await queryInterface.sequelize.query("DROP FUNCTION defaulter_create;");
  }
};
