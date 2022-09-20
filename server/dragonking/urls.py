from django.urls import path,include
from . import views
from rest_framework import routers
from django.conf.urls import *
router = routers.DefaultRouter()
router.register('User', views.UserView)
router.register('House', views.HouseView)
router.register('PunishCard', views.PunishCardView)
router.register('PunishChoose', views.PunishChooseView)
router.register('HouseUser', views.HouseUserView)

urlpatterns = [
    path('', include(router.urls)),
    path(r'userLogin/',views.userLogin),
    path(r'buildHouse/',views.buildHouse),
    path(r'joinHouse/',views.joinHouse),
    path(r'userGetReady/',views.userGetReady),
    path(r'startGame/',views.startGame),
    path(r'punishCardIndex/',views.punishCardIndex),
    path(r'choosePunish/',views.choosePunish),
    path(r'leaveHouse/',views.leaveHouse),
    path(r'punishCardIndexAllVersion/',views.punishCardIndexAllVersion),
    path(r'userInfoaboutHouse/',views.userInfoaboutHouse),
    path(r'showPunishedStatusforOthers/',views.showPunishedStatusforOthers),
    path(r'changePunish/',views.changePunish),
    path(r'acceptPunish/',views.acceptPunish),
    path(r'newUserLogin/',views.newUserLogin),
]

