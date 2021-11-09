<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use App\Entity\User;

class JwtCreatedSubscriber {
    public function updateJwtData(JWTCreatedEvent $event) 
    {
        // 1. Récupérer l'utilisateur (pour avoir son firstName et son LastName)
        $user = $event->getUser();

        // 2. Enrichir les datas pour qu'elles contiennent ces données
        if($user instanceof User)
        {
        $data = $event->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);
        }
    }
}