# API_1

Routes:

---

## post /newuser registro nuevo usuario body/ email + password

## post /login login usuario body/ email + password devuelve token con id user

## get /user info usuario necesita token

## get /user/:username cambio username params/ username necesita token

## post /post nuevo comentario form-data/ text + image necesita token

## get /coments todos los comentarios

## get /comentsuser/:id todos los comentarios de un usuario params/iduser

delete /comentsuser/:id" delete Coments By Id paramns/:idcoment
