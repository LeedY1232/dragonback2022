from rest_framework import serializers
from .models import User
from .models import House
from .models import PunishCard
from .models import PunishChoose
from .models import HouseUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('openid','nick_name','head_pic','if_inhouse','if_ready',
                    'if_being_punished')

class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = ('house_id','house_owner')

class HouseUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseUser
        fields = ('id','house_id','user_openid')

class PunishCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PunishCard
        fields = ('id','content','level','kind','is_front','gender')

class PunishChooseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PunishChoose
        fields = ('id','user_openid','card_id','if_change')
