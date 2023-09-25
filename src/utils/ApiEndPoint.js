const ApiEndPoint = {
  createAccount: 'v1/create-account',
  verifyPhoneNumber: 'v1/verify-phone-number',
  createProfile: 'v1/create-profile',
  createPin: 'v1/create-pin',
  login: 'v1/login',
  checkSocial: 'v1/social-login',
  logout: 'v1/logout',
  forgotPass: 'v1/forgot-password',

  //payment
  addCard: 'v1/payment/add-card',
  cardList: 'v1/payment/card-list',
  deleteCard: 'v1/payment/delete-card',
  verifyTransactionPin: 'v1/payment/verify-pin',
  addCommodity: 'v1/commodity/add',
  calculation: 'v1/commodity/calculation',
  createIntent: 'v1/payment/create-intent',
  confirmIntent: 'v1/payment/confirm-intent',
  addBank: 'v1/payment/external-bank-account',

  account_details: 'v1/payment/check-account-status',
  link_account: 'v1/payment/get-account-link',

  //home
  commodityRates: 'v1/get-commodity-rates',
  getWalletAmount: 'v1/user-total-cash',
  userList: 'v1/user-list',
  sendComodity: 'v1/commodity/send',
  requestCommodity: 'v1/commodity/request',
  requestList: 'v1/commodity/requests',
  requestAction: 'v1/commodity/request-action',

  //Transaction List
  transactionList: 'v1/transaction-list',
  //Vault Screen
  vault: 'v1/payment/vault',

  //Add Money to vault
  addMoneyIntoVault: 'v1/commodity/add-money',
  // Profile Data
  myProfile: 'v1/user-detail',
  updateProfile: 'v1/user/update-profile',
  notification_status: 'v1/user/notification-setting',
  change_pin: 'v1/user/change-pin',
  change_pass: 'v1/user/change-password',
  // Withdraw cash
  withdrawCash: 'v1/payment/withdraw-cash',
  paymentFee: 'v1/payment/gateway-fee',
  convert_into_cash: 'v1/commodity/convert-into-cash',
  deliver_physical: 'v1/commodity/deliver-physical',
  receive_physical: 'v1/commodity/receive-physical',
  check_availability: 'v1/commodity/check-availability',

  notification_list: 'v1/notification-list',
  read_status: 'v1/update-notification-read-status',

  // get user details api
  user_details: 'v1/get-user-detail',
  // Shipment
  admin_address: 'v1/shipping/address',
  shipping_rate: 'v1/shipping/rates',
  shipping_calculation: 'v1/shipping/calculation',
  create_shipment: 'v1/shipping/create',
  myshipment_list: 'v1/shipping/list',

  ship_to_me: 'v1/shipping/request',
  cancelShip: 'v1/shipping/request-cancel',
  shipping_details: 'v1/shipping/detail',
  trackingUrl: 'v1/shipping/generate-label-track',
};

export default ApiEndPoint;
