<?php

$app->post('/auth/signup', 'AuthController:postSignup');
$app->post('/auth/signup_login', 'AuthController:postSigninLoginField');
$app->post('/auth/signup_email', 'AuthController:postSigninEmailField');
$app->post('/auth/signup_firstname', 'AuthController:postSigninFirstnameField');
$app->post('/auth/signup_lastname', 'AuthController:postSigninLastnameField');
$app->post('/auth/signup_password', 'AuthController:postSigninPasswordField');
$app->post('/auth/signup_password_repeat', 'AuthController:postSigninPasswordRepeatField');
$app->post('/auth/get_user', 'AuthController:getCurrentUser');
$app->post('/auth/create_access_token', 'AuthController:createNewAccessToken');

$app->get('/auth/confirm', 'AuthController:confirmSignin');

$app->post('/auth/signin', 'AuthController:postSignin');

$app->post('/auth/forgotpassword', 'AuthController:postForgotPassword');

$app->post('/profile/edit', 'ProfileController:postEditProfile');
$app->post('/profile/change_password', 'ProfileController:postChangePassword');
$app->post('/profile/post_main_picture', 'ProfileController:postMainPicture');
$app->post('/profile/post_additional_pictures', 'ProfileController:postAdditionalPictures');
$app->post('/profile/get_profile', 'ProfileController:getProfileByLogin');
$app->post('/profile/get_profile_by_user_id', 'ProfileController:getProfileByUserId');
$app->post('/profile/id_exists', 'ProfileController:idExists');
$app->post('/profile/remove_main_picture', 'ProfileController:removeMainPicture');
$app->post('/profile/get_access_level', 'ProfileController:getAccessLevel');
$app->post('/profile/add_to_chat_history', 'ProfileController:addToChatHistory');
$app->post('/profile/get_chat_history', 'ProfileController:getChatHistory');
$app->post('/profile/get_all_users_for_map', 'ProfileController:getAllUsersInfo');

$app->post('/likes_views/handle_like', 'LikesViewsController:handleLike');
$app->post('/likes_views/handle_view', 'LikesViewsController:handleView');
$app->post('/likes_views/get_likes', 'LikesViewsController:getLikes');
$app->post('/likes_views/get_views', 'LikesViewsController:getViews');
$app->post('/likes_views/report_user', 'LikesViewsController:reportUser');
$app->post('/likes_views/block_user', 'LikesViewsController:blockUser');
$app->post('/likes_views/is_likes', 'LikesViewsController:isLiked');
$app->post('/likes_views/is_reported', 'LikesViewsController:isReported');
$app->post('/likes_views/is_blocked', 'LikesViewsController:isBlocked');
$app->post('/likes_views/get_connected', 'LikesViewsController:getConnectedUsers');

$app->post('/browse/ultimate_search', 'BrowseController:ultimateSearch');
?>
