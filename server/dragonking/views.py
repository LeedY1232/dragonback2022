from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
import random
from django.core import serializers
from rest_framework import viewsets
from .models import User
from .models import House
from .models import PunishCard
from .models import PunishChoose
from .models import HouseUser
from .serializers import UserSerializer
from .serializers import HouseSerializer
from .serializers import PunishCardSerializer
from .serializers import PunishChooseSerializer
from .serializers import HouseUserSerializer
import requests

# Create your views here.


class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class HouseView(viewsets.ModelViewSet):
    queryset = House.objects.all()
    serializer_class = HouseSerializer


class PunishCardView(viewsets.ModelViewSet):
    queryset = PunishCard.objects.all()
    serializer_class = PunishCardSerializer


class PunishChooseView(viewsets.ModelViewSet):
    queryset = PunishChoose.objects.all()
    serializer_class = PunishChooseSerializer


class HouseUserView(viewsets.ModelViewSet):
    queryset = HouseUser.objects.all()
    serializer_class = HouseUserSerializer


def newUserLogin(request):
    code = request.GET.get("code")
    wxurl = 'https://api.weixin.qq.com/sns/jscode2session'
    data = {
        'appid':'wx7e7fa404e4354e31',
        'secret':'6ca744e158717b09fd8e6591629a7672',
        'js_code': code,
        'grant_type': 'authorization_code',
    }
    wxres = requests.post(wxurl,data=data)
    user_openid = json.loads(wxres.text)['openid']
    return JsonResponse({'openid':user_openid,'message':'success'})


def userLogin(request):
    user_openid = request.GET.get("openid")
    saved_user = User.objects.filter(openid=user_openid).first()
    nick_name = request.GET.get('nick_name')
    head_pic = request.GET.get('head_pic')
    text_content = dict()
    if not saved_user:
        new_user = User.objects.create(openid=user_openid,nick_name=nick_name,head_pic=head_pic)
        new_user.save()
        text_content['openid'] = new_user.openid
        text_content['nick_name'] = new_user.nick_name
        text_content['newuser'] = 1

    else:
        text_content['openid'] = saved_user.openid
        text_content['nick_name'] = saved_user.nick_name
        text_content['newuser'] = 0
    text_content['message'] = 'success'
    return HttpResponse(json.dumps(text_content, ensure_ascii=False), content_type="application/json")


def buildHouse(request):  # 获取创建人openid，返回房间id号
    openid = request.GET.get('openid')
    kind = int(request.GET.get('gender_kind'))
    if kind == None:
        kind = 3
    user = User.objects.filter(openid=openid).first()
    user.if_inhouse = True
    house_id = random.randint(100000, 999999)
    while len(House.objects.filter(house_id=house_id)) != 0:
        house_id = random.randint(100000, 999999)
    new_house = House.objects.create(
        house_id=house_id, house_owner=user,gender_kind = kind)
    new_house.save()
    return JsonResponse({'house_id': new_house.house_id, 'message': '成功创建房间'})


def joinHouse(request):
    openid = request.GET.get('openid')
    house_id = request.GET.get('house_id')
    user_obj = User.objects.filter(openid=openid).first()
    house_obj = House.objects.filter(house_id=int(house_id)).first()
    new_houseuser_obj = HouseUser.objects.create(
        user_openid=user_obj, house_id=house_obj)
    user_obj.if_inhouse = True
    user_obj.save()
    new_houseuser_obj.save()
    if house_obj.house_owner==user_obj:
        if_owner=True
    else:
        if_owner=False
    return JsonResponse({'code': '1', 'message': '成功加入房间','if_owner':if_owner,'owner_id':house_obj.house_owner.openid,'if_game_start':house_obj.house_owner.if_ready})


def userGetReady(request):
    openid = request.GET.get('openid')
    user = User.objects.filter(openid=openid).first()
    if user.if_ready == False:
        user.if_ready = True
    else:
        user.if_ready = False
    user.save()
    return JsonResponse({'code': '1', 'message': '成功修改准备状态'})


def startGame(request):
    house_id = request.GET.get('house_id')
    house_obj = House.objects.filter(house_id=int(house_id)).first()
    house_owner = house_obj.house_owner
    house_owner.if_ready = True
    house_owner.save()
    house_obj.save()
    openid = request.GET.get('punished_openid')
    punished_user_obj = User.objects.filter(openid=openid).first()
    punished_user_obj.if_being_punished = True
    punished_user_obj.save()
    return JsonResponse({'code': '1', 'message': '游戏开始'})


def punishCardIndex(request): # 提供6个惩罚
    # candidate values： truth or challenge
    punish_way = request.GET.get('way_for_punishing')
    house_id = request.GET.get('house_id')
    house_obj = House.objects.filter(house_id=house_id).first()
    card_list = PunishCard.objects.filter(kind=punish_way,gender = house_obj.gender_kind)
    card_index = []
    index = random.sample(range(0, len(card_list)), 6)  # 从数组范围内生成六个不等的随机数
    for i in range(6):
        card_serializer = PunishCardSerializer(card_list[index[i]])
        card_index.append(card_serializer.data)
    # 直接作为数组传输给前端，如果不行则转为HttpResponse尝试
    return JsonResponse({'punish_card_index': card_index})


def choosePunish(request): # 用户选择惩罚
    punished_openid = request.GET.get('openid')
    user_obj = User.objects.filter(openid=punished_openid).first()
    user_obj.save()
    punish_card_id = request.GET.get('card_id')
    card_obj = PunishCard.objects.filter(id=punish_card_id).first()
    new_punishment = PunishChoose.objects.create(
        user_openid=user_obj, card_id=card_obj)  # 生成处罚    对象
    new_punishment.save()
    return JsonResponse({'code': '1', 'message': '选择惩罚成功'})


def changePunish(request): 
    # 用户更换惩罚 参传过来 再传回去。其实不用回传数据也行，这个函数作用在于修改数据库内容，使得其他玩家同步看到他的更改
    punished_openid = request.GET.get('openid')
    user_obj = User.objects.filter(openid=punished_openid).first()
    changed_card_id = request.GET.get('card_id')
    punishchoose_obj = PunishChoose.objects.filter(user_openid=user_obj).first()
    changed_card_obj = PunishCard.objects.filter(id=changed_card_id).first()
    punishchoose_obj.card_id = changed_card_obj
    punishchoose_obj.if_change = True
    punishchoose_obj.save()
    punishchoose_message = dict()
    punishchoose_message['punished_user_id'] = punished_openid
    punishchoose_message['punished_card_id'] = changed_card_id
    return JsonResponse({'code':'1', 'punishchoose_message':punishchoose_message})


def acceptPunish(request):
    # 建议加上已完成的按钮，作为调用此请求的触发
    punished_openid = request.GET.get('openid')
    house_id = request.GET.get('house_id')
    house_obj = House.objects.filter(house_id=house_id).first()
    house_owner = house_obj.house_owner
    house_owner.if_ready = False
    house_owner.save()
    house_obj.save()
    user_obj = User.objects.filter(openid=punished_openid).first()
    punishchoose_obj = PunishChoose.objects.filter(user_openid=user_obj).first()
    punishchoose_obj.delete()
    user_obj.if_being_punished = False # 用户恢复状态
    user_obj.save()
    return JsonResponse({'code':'1','message':'用户接受了这一惩罚，进入下一轮'})


def leaveHouse(request):  # 用户离开房间
    house_id = request.GET.get('house_id')
    house_obj = House.objects.filter(house_id=house_id).first()
    user_id = request.GET.get('openid')
    user_obj = User.objects.filter(openid=user_id).first()
    user_obj.if_inhouse = False
    user_obj.if_ready = False
    user_obj.if_being_punished = False
    if user_obj != house_obj.house_owner:
        this_houseuser_obj = HouseUser.objects.filter(
            house_id=house_obj, user_openid=user_obj)
        this_houseuser_obj.delete()
    else:  # 如果用户是房主的话，则退回初始状态
        house_obj.delete()
    user_obj.save()
    return JsonResponse({'code': '1', 'message': '退出成功'})


def punishCardIndexAllVersion(request):
    gender = request.GET.get('gameType')
    card_list_for_truth = PunishCard.objects.filter(kind='truth',gender=int(gender))
    card_list_for_challenge = PunishCard.objects.filter(kind='challenge',gender=int(gender))
    truth_card_list = []
    challenge_card_list = []
    for card in card_list_for_truth:
        card_serializer = PunishCardSerializer(card)
        truth_card_list.append(card_serializer.data)
    for card in card_list_for_challenge:
        card_serializer = PunishCardSerializer(card)
        challenge_card_list.append(card_serializer.data)
    return JsonResponse({'code': '1', 'truth': truth_card_list, 'challenge': challenge_card_list})


def userInfoaboutHouse(request):
    house_id = request.GET.get('house_id')
    house_obj = House.objects.filter(house_id=house_id).first()
    users = HouseUser.objects.filter(house_id=house_obj)
    content_text = []
    if len(users) != 0:
        for user in users:
            user_serializer = UserSerializer(user.user_openid)
            content_text.append(user_serializer.data)
    else:
        pass
    content_text.append(house_id)
    return JsonResponse({'code': 1, 'content': content_text})


def showPunishedStatusforOthers(request):
    # 呈现状态为惩罚状态的用户信息及选择的惩罚卡片内容，同步给其他用户
    house_id = request.GET.get('house_id')
    house_obj = House.objects.filter(house_id=house_id).first()
    houseuser_objs = HouseUser.objects.filter(house_id=house_obj)
    punishuser_info = dict()
    temp = 0
    if len(houseuser_objs) != 0:
        for houseuser_obj in houseuser_objs:
            if houseuser_obj.user_openid.if_being_punished:
                punishchoose_obj = PunishChoose.objects.filter(user_openid = houseuser_obj.user_openid)
                if len(punishchoose_obj) > 0:
                    card_serializer = PunishCardSerializer(punishchoose_obj[0].card_id)
                    punishuser_info['card_info'] = card_serializer.data
                    punishuser_info['user_openid'] = houseuser_obj.user_openid.openid
                else:
                    return JsonResponse({'code':'-1','message':'正在选择惩罚中'})
            else:
                temp+=1
        if temp == len(houseuser_objs):
            punishuser_info['card_info'] = None
            punishuser_info['user_openid'] = None
    else:
        punishuser_info['card_info'] = None
        punishuser_info['user_openid'] = None
    return JsonResponse({'code':'1','punishuser_info':punishuser_info})
