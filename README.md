# API_Justify
<h1>API REST qui justifie un texte passé en paramètre.</h1>
<ul>
<li>La longueur des lignes du texte justifié doit être de 80 caractères.</li>
<li>api utiliser un mécanisme d’authentification via token unique.En utilisant par exemple une endpoint api/token qui retourne un token d’une requête POST avec un json body {"email": "foo@bar.com"}.</li>
<li>Il doit y avoir un rate limit par token pour l’endpoint /api/justify, fixé à 80 000 mots par jour, si il y en a plus dans la journée il faut alors renvoyer une erreur 402 Payment Required.</li>
</ul>