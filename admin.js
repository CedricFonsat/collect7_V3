import AdminJS from 'adminjs';
import AdminJSMongoose from '@adminjs/mongoose';
import AdminJSExpress from '@adminjs/express';
import userModel from './src/model/userModel.js';
import cardModel from './src/model/cardModel.js';
import collectionModel from './src/model/collectionModel.js';

AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({

  branding: {
    companyName: 'Collect7',
    logo: 'https://i.postimg.cc/qvnYLxKS/Collect7.png',
  },

  resources: [
    {
      resource: userModel,
      options: {
        listProperties: ['username', 'email'],
        filterProperties: ['username', 'email'],
        editProperties: ['username', 'email', 'password'],
      },
    },
    {
      resource: cardModel,
      options: {
        listProperties: ['name', 'price', 'collections', 'image'],
        filterProperties: ['name', 'price', 'collections', 'image'],
        editProperties: ['name', 'price', 'price', 'collections', 'image'],
      },
    },
    {
      resource: collectionModel,
      options: {
        listProperties: ['name', 'category', 'description'],
        filterProperties: ['name', 'category', 'description'],
        editProperties: ['name', 'category', 'description'],
      },
    },
  ],
  
  locale: {
    language: 'fr',
    translations: {
      actions: {
        new: 'Créer nouveau',
        edit: 'Éditer',
        show: 'Voir',
        delete: 'Supprimer',
        bulkDelete: 'Tout supprimer',
        list: 'Liste',
      },
      buttons: {
        save: 'Sauvegarder',
        addNewItem: 'Ajouter un nouvel objet',
        filter: 'Filtrer',
        applyChanges: 'Appliquer les modifications',
        resetFilter: 'Réinitialiser',
        confirmRemovalMany: 'Confirmer la suppression de {{count}} enregistrement',
        confirmRemovalMany_plural: 'Confirmer la suppression de {{count}} enregistrements',
        logout: 'Se déconnecter',
        login: 'Se connecter',
        seeTheDocumentation: 'Voir: <1>la documentation</1>',
        createFirstRecord: 'Créer le premier enregistrement',
      },
      labels: {
        navigation: 'Navigation',
        pages: 'Pages',
        selectedRecords: 'Sélectionné ({{selected}})',
        filters: 'Filtres',
        adminVersion: 'Admin: {{version}}',
        appVersion: 'App: {{version}}',
        loginWelcome: 'Bienvenue',
        dashboard: 'Dashboard',
      },
      properties: {
        length: 'Length',
        from: 'From',
        to: 'To',
      },
      resources: {},
      messages: {
        successfullyBulkDeleted: '{{count}} enregistrement supprimé avec succès',
        successfullyBulkDeleted_plural: '{{count}} enregistrements supprimé avec succès',
        successfullyDeleted: 'L\'enregistrement a bien été supprimé',
        successfullyUpdated: 'L\'enregistrement a bien été modifié',
        thereWereValidationErrors: 'Il y a des erreurs de validation - vérifiez-les ci-dessous',
        forbiddenError: 'Vous ne pouvez pas effectuer l\'action {{actionName}} sur {{resourceId}}',
        anyForbiddenError: 'Vous ne pouvez pas effectuer l\'action donnée',
        successfullyCreated: 'Un nouvel enregistrement a été créé avec succès',
        bulkDeleteError: 'Une erreur s\'est produite lors de la suppression des enregistrements, consultez la console pour voir plus d\'informations',
        errorFetchingRecords: 'Une erreur s\'est produite lors de la récupération des enregistrements, consultez la console pour voir plus d\'informations',
        errorFetchingRecord: 'Une erreur s\'est produite lors de la récupération de l\'enregistrement. Consultez la console pour obtenir plus d\'informations.',
        noRecordsSelected: 'Vous n\'avez sélectionné aucun enregistrement',
        theseRecordsWillBeRemoved: 'L\'enregistrement suivant sera supprimé',
        theseRecordsWillBeRemoved_plural: 'Les enregistrements suivants seront supprimés',
        pickSomeFirstToRemove: 'Pour supprimer des enregistrements, vous devez d\'abord les sélectionner',
        error404Resource: 'La ressource aillant l\'identifiant: {{resourceId}} est introuvable',
        error404Action: 'La ressource aillant l\'identifiant: {{resourceId}} n\'a pas d\'action avec le nom: {{actionName}} ou vous n\'êtes pas autorisé à l\'utiliser !',
        error404Record: 'La ressource aillant l\'identifiant: {{resourceId}} n\'a pas d\'enregistrement avec l\'identifiant : {{recordId}} ou vous n\'êtes pas autorisé à l\'utiliser !',
        seeConsoleForMore: 'Voir la console de développement pour plus de détails...',
        noActionComponent: 'Vous devez implémenter un composant d\'action pour votre action',
        noRecordsInResource: 'Il n\'y a pas d\'enregistrements dans cette ressource',
        noRecords: 'Pas d\'enregistrements',
        confirmDelete: 'Voulez-vous vraiment supprimer cet élément ?',
      },
    },
  },
});

const adminRoute = AdminJSExpress.buildRouter(adminJs);

export default adminRoute;