DO $$
DECLARE
--id fields
idfieldsituationcode bigint;
idfieldslatitude bigint;
idfieldslongitude bigint;
idfieldsaddress bigint;
idfieldsdate bigint;
idfieldstime bigint;
idfieldscomment bigint;
idfieldsimages bigint;
idfieldsinsname bigint;
idfieldsinstype bigint;
idfieldsvalue bigint;

--id forms
idfloodzonesform bigint;
idrainform bigint;
idriverform bigint;
idpluvform bigint;
idpluvregsform bigint;

BEGIN
---------------------------------- Fields --------------------------------------------------
  --situação do evento
  INSERT INTO fields(idfieldsdatatypes, name, description, fillingclue, active)
     SELECT fdt.id, 'Situation', 'situation of the event', '', 1 
       FROM fieldsdatatypes fdt 
      WHERE fdt.name = 'text' 
      RETURNING id INTO idfieldsituationcode;

  --Latitude
  INSERT INTO fields(idfieldsdatatypes, name, description, fillingclue, active)
    SELECT fdt.id, 'Latitude', 'Event location latitude', '', 1 
      FROM fieldsdatatypes fdt 
     WHERE fdt.name = 'real'
      RETURNING id INTO idfieldslatitude;

  --Longitude
  INSERT INTO fields(idfieldsdatatypes, name, description, fillingclue, active)
    SELECT fdt.id, 'Longitude', 'Event location longitude', '', 1 
      FROM fieldsdatatypes fdt 
     WHERE fdt.name = 'real'
      RETURNING id INTO idfieldslongitude;

  --Endereço 
  INSERT INTO fields(idfieldsdatatypes, name, description, fillingclue, active)
    SELECT fdt.id, 'Address', 'Event adress', '', 1 
      FROM fieldsdatatypes fdt 
     WHERE fdt.name = 'text'
      RETURNING id INTO idfieldsaddress;

  --Data
  INSERT INTO fields(idfieldsdatatypes, name, description, fillingclue, active)
    SELECT fdt.id, 'Date_event', 'Event date', '', 1 
      FROM fieldsdatatypes fdt 
     WHERE fdt.name = 'text'
      RETURNING id INTO idfieldsdate;

  --Hora
  INSERT INTO fields(idfieldsdatatypes, name, description, fillingclue, active)
    SELECT fdt.id, 'Time_event', 'Event time', '', 1 
      FROM fieldsdatatypes fdt
     WHERE fdt.name = 'text'
      RETURNING id INTO idfieldstime;
  
  --Comentário  
  INSERT INTO fields(idfieldsdatatypes, name, description, fillingclue, active)
    SELECT fdt.id, 'Comment', 'Additional comment about the event', '', 1 
      FROM fieldsdatatypes fdt 
     WHERE fdt.name = 'text'
      RETURNING id INTO idfieldscomment;   
  
  --Imagens 
  INSERT  INTO fields(idfieldsdatatypes, name, description, fillingclue, active)
      SELECT fdt.id, 'Images', 'Event Images', '', 1  
      FROM fieldsdatatypes fdt 
       WHERE fdt.name = 'text'
        RETURNING id INTO idfieldsimages;

  --Qtd de agua no pluviometro
  INSERT  INTO fields(idfieldsdatatypes, name, description, fillingclue, active)
      SELECT fdt.id, 'Rain_amount', 'amount of rain recorded in the pluviometer', '', 1  
      FROM fieldsdatatypes fdt 
       WHERE fdt.name = 'real'
        RETURNING id INTO idfieldsvalue;

  --Tipo da instituição
   INSERT  INTO fields(idfieldsdatatypes, name, description, fillingclue, active)
      SELECT fdt.id, 'Institute_type', 'Kind of an institute', '', 1  
      FROM fieldsdatatypes fdt WHERE fdt.name = 'text'
        RETURNING id INTO idfieldsinstype;

  --Nome da Instituição 
  INSERT  INTO fields(idfieldsdatatypes, name, description, fillingclue, active)
      SELECT fdt.id, 'Institute_name', 'Name of an institute', '', 1  
      FROM fieldsdatatypes fdt 
       WHERE fdt.name = 'text'
        RETURNING id INTO idfieldsinsname;

---------------------------------- Formulários ---------------------------------------
--Begin FloodZones Form 
  INSERT INTO forms(idformsorigins, code, name, description, dtcreation, active, source) 
     SELECT fo.id, 'FLOODZONES_FORM', 'Flood Zones Form', 'Flood Zones Form', current_timestamp, 1, , "citizen" 
       FROM formsorigins fo 
      WHERE fo.name = 'WP6.MobileApp'
    RETURNING id INTO idfloodzonesform;

  --situação
    INSERT INTO formsfields(id, idforms, idfields, active)
       VALUES (DEFAULT, idfloodzonesform, idfieldsituationcode, 1);

  --local (lat, log e endereço)
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idfloodzonesform, idfieldslatitude, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idfloodzonesform, idfieldslongitude, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idfloodzonesform, idfieldsaddress, 1);

  --data e hora
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idfloodzonesform, idfieldsdate, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idfloodzonesform, idfieldstime, 1);

  --comentário
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idfloodzonesform, idfieldscomment, 1);   

  --imagens 
    INSERT INTO formsfields(id, idforms, idfields, active) 
      VALUES (DEFAULT, idfloodzonesform, idfieldsimages, 1);  
--End FloodZones Form

--Begin Rain Form
  INSERT INTO forms(idformsorigins, code, name, description, dtcreation, active, source) 
    SELECT fo.id, 'RAIN_FORM', 'Rain', 'Rain zones Form', current_timestamp, 1, "citizen" 
      FROM formsorigins fo 
     WHERE fo.name = 'WP6.MobileApp' 
    RETURNING id INTO idrainform;

  --situação
    INSERT INTO formsfields(id, idforms, idfields, active)
       VALUES (DEFAULT, idrainform, idfieldsituationcode, 1);

  --local (lat, log e endereço)
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idrainform, idfieldslatitude, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idrainform, idfieldslongitude, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idrainform, idfieldsaddress, 1);

  --data e hora
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idrainform, idfieldsdate, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idrainform, idfieldstime, 1);

  --comentário
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idrainform, idfieldscomment, 1);   

  --imagens 
    INSERT INTO formsfields(id, idforms, idfields, active) 
      VALUES (DEFAULT, idrainform, idfieldsimages, 1);  
--End Rain Form

--Begin Pluviometer Form
  INSERT INTO forms(idformsorigins, code, name, description, dtcreation, active, source) 
    SELECT fo.id, 'PLUVIOMETERS_FORM', 'Pluviometers', 'Pluviometers Form', current_timestamp, 1, "citizen" 
      FROM formsorigins fo 
     WHERE fo.name = 'WP6.MobileApp' 
    RETURNING id INTO idpluvform;
  
  --qtd de chuva
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvform, idfieldsvalue, 1);

  --local (lat, log e endereço)
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvform, idfieldslatitude, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvform, idfieldslongitude, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvform, idfieldsaddress, 1);

  --data e hora
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvform, idfieldsdate, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvform, idfieldstime, 1);

  --comentário
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvform, idfieldscomment, 1);   

  --imagens 
    INSERT INTO formsfields(id, idforms, idfields, active) 
      VALUES (DEFAULT, idpluvform, idfieldsimages, 1);  
--End Pluviometer Form
--Begin River Form
  INSERT INTO forms(idformsorigins, code, name, description, dtcreation, active, source) 
    SELECT fo.id, 'RIVERFLOOD_FORM', 'River Flood', 'River Flood Form', current_timestamp, 1, "citizen" 
      FROM formsorigins fo 
     WHERE fo.name = 'WP6.MobileApp' 
    RETURNING id INTO idriverform;

  --situação
    INSERT INTO formsfields(id, idforms, idfields, active)
       VALUES (DEFAULT, idriverform, idfieldsituationcode, 1);

  --local (lat, log e endereço)
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idriverform, idfieldslatitude, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idriverform, idfieldslongitude, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idriverform, idfieldsaddress, 1);

  --data e hora
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idriverform, idfieldsdate, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idriverform, idfieldstime, 1);

  --comentário
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idriverform, idfieldscomment, 1);   

  --imagens 
    INSERT INTO formsfields(id, idforms, idfields, active) 
      VALUES (DEFAULT, idriverform, idfieldsimages, 1);  
--End River Form

--Pluviometer Registration Form
  INSERT INTO forms(idformsorigins, code, name, description, dtcreation, active, source) 
    SELECT fo.id, 'PLUVIOMETERS_REGISTRATION', 'Pluviometer registration', 'Pluviometer registration', current_timestamp, 1, "citizen" 
      FROM formsorigins fo 
     WHERE fo.name = 'WP6.MobileApp' 
    RETURNING id INTO idpluvregsform;

  --local (lat, log e endereço)
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvregsform, idfieldslatitude, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvregsform, idfieldslongitude, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvregsform, idfieldsaddress, 1);

  --data e hora
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvregsform, idfieldsdate, 1);

    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvregsform, idfieldstime, 1);

  --Instituição (tipo e nome)
    INSERT INTO formsfields(id, idforms, idfields, active) 
       VALUES (DEFAULT, idpluvregsform, idfieldsinstype, 1);  

    INSERT INTO formsfields(id, idforms, idfields, active) 
      VALUES (DEFAULT, idpluvregsform, idfieldsinsname, 1);  
--End Pluviometer Registration Form
END $$;
