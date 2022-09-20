from django.db import models



# Create your models here.





class User(models.Model):

    openid = models.CharField(primary_key=True, max_length=100)

    nick_name = models.CharField(max_length=100)

    head_pic = models.CharField(max_length=200)

    if_inhouse = models.BooleanField(default=False)

    if_ready = models.BooleanField(default=False)

    if_being_punished = models.BooleanField(default=False)





class HouseUser(models.Model):

    house_id = models.ForeignKey('House',on_delete=models.CASCADE)

    user_openid = models.ForeignKey('User',on_delete=models.CASCADE)





class House(models.Model):

    GENDER_LIST = (

        (1, 'boys\' party'),

        (2, 'girls\' party'),

        (3, 'mixed party'),

    )

    house_id = models.IntegerField(primary_key=True)

    house_owner = models.ForeignKey('User', on_delete=models.CASCADE)

    gender_kind = models.IntegerField(default=3, choices=GENDER_LIST)





class PunishCard(models.Model):

    LEVEL_LIST = (

        (1, 'No.1 Rank'),

        (2, 'No.2 Rank'),

        (3, 'No.3 Rank'),

    )

    KIND_LIST = (

        ('truth', '真心话'),

        ('challenge', '大冒险'),

        ('special_magic_card', '魔法卡片'),

    )

    GENDER_LIST = (

        (1, 'boys\' party'),

        (2, 'girls\' party'),

        (3, 'mixed party'),

    )

    content = models.CharField(default='', max_length=300)
    level = models.CharField(default=1, max_length=10, choices=LEVEL_LIST)
    kind = models.CharField(default='truth', max_length=20, choices=KIND_LIST)
    is_front = models.BooleanField(default=False)
    gender = models.IntegerField(default=1, choices=GENDER_LIST)





class PunishChoose(models.Model):

    user_openid = models.ForeignKey('User', on_delete=models.CASCADE)

    card_id = models.ForeignKey('PunishCard', on_delete=models.CASCADE)

    if_change = models.BooleanField(default=False)


