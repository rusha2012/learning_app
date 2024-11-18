const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const tokenService = require('../services/token.service'); 

const createUser = catchAsync(async (req, res) => {

  // const { device_id, device_type, device_token, ...userData } = req.body;
  const user = await userService.createUser(req.body);
  // const tokens = await tokenService.generateAuthTokens(user, device_id, device_type, device_token);

  res.status(httpStatus.CREATED).send({
    user,
    // tokens,
  });
});


const loginUser= catchAsync(async(req,res) =>{
  const { email, password, device_id, device_type, device_token } = req.body;

  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  const tokens = await tokenService.generateAuthTokens(user, device_id, device_type, device_token);

  res.status(httpStatus.OK).send({
    user,
    tokens,
  });
})


const getuserprofile = catchAsync (async(req,res)=>{

  const {id} = req.user;

  const user = await userService.getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.OK).send({
    id,
    user
  });

})



const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});




const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  getuserprofile
};
