const sql_query = module.exports

/**
 * Query to get specific formsAnswers and all its fieldAnswers (attributes) associated to it in JSON format
 * 
 * @param {number} faId formsAnswers ID
 * @param {string} db_schema 
 * @returns {JSON} 
 */
sql_query.byId = (db_schema, userSchema) => {
    console.log('>>> byId ')
    return `select array_to_json(array_agg(fa))
    from
    (
    select 
        fa.id as formsanswersid, 
        f.code as formcode, 
        ui.id as formsanswersuserinformer, 
        fa.latitude as formsanswerslatitude,
        fa.longitude as formsanswerslongitude,
        ST_AsGeoJSON(geom) as formsanswersgeom,
        (
            select array_to_json(array_agg(fia))
            from (
                select 
                    fia.id as fieldsanswersid,
                    fia.idfields as fieldsanswersfieldsid,
                    ff.name as fieldname,
                    fia.value as fieldsanswersvalue,
                    fia.dtfilling as fieldsanswersdtfilling
                from 
                    ${db_schema}.fieldsanswers fia,
                    ${db_schema}.fields ff
                WHERE
                    fia.idformsanswers = fa.id
                    and fia.idfields = ff.id 
            ) fia
        ) as fias
    from 
        ${db_schema}.formsanswers fa
        inner join ${db_schema}.forms f on fa.idforms = f.id
        inner join ${userSchema}.users ui on fa.idusersinformer = ui.id
    where
        fa.id = $1
    ) fa `
}

/* sql_query.byIdWithBbox = (faId, bbox, db_schema) => {
    console.log('>>> byIdWithBbox ')
    return `select array_to_json(array_agg(fa))
    from
    (
    select 
        fa.id as formsanswersid, 
        f.code as formcode, 
        ui.id as formsanswersuserinformer, 
        fa.latitude as formsanswerslatitude,
        fa.longitude as formsanswerslongitude,
        ST_AsGeoJSON(ST_Intersection(geom, ST_MakeEnvelope(${bbox}, 4326))) as formsanswersgeom,
        (
            select array_to_json(array_agg(fia))
            from (
                select 
                    fia.id as fieldsanswersid,
                    fia.idfields as fieldsanswersfieldsid,
                    ff.name as fieldname,
                    fia.value as fieldsanswersvalue,
                    fia.dtfilling as fieldsanswersdtfilling
                from 
                    ${db_schema}.fieldsanswers fia,
                    ${db_schema}.fields ff
                WHERE
                    fia.idformsanswers = fa.id
                    and fia.idfields = ff.id 
            ) fia
        ) as fias
    from 
        ${db_schema}.formsanswers fa
        inner join ${db_schema}.forms f on fa.idforms = f.id
        inner join ${userSchema}.users ui on fa.idusersinformer = ui.id
        and geom && ST_MakeEnvelope(${bbox}, 4326)
    where
        fa.id = ${faId}
    ) fa `
} */

sql_query.byIdWithBbox = (bbox, db_schema, userSchema) => {

    if(!(bbox))
        return ''

    return `
    select array_to_json(array_agg(fa))
    from
    (
        select
            fa.id as formsanswersid, 
            f.code as formcode,
            ui.id as formsanswersuserinformer,
            fa.latitude as formsanswerslatitude,
            fa.longitude as formsanswerslongitude,
            ST_AsGeoJSON(ST_Intersection(geom, ST_MakeEnvelope(${bbox}, 4326))) as formsanswersgeom
        from ${db_schema}.formsanswers fa
        inner join ${db_schema}.forms f on (fa.idforms = f.id )
        inner join ${userSchema}.users ui on fa.idusersinformer = ui.id
        where 1=1 
            and ST_Intersects(fa.geom, ST_MakeEnvelope(${bbox}, 4326)) 
            and fa.id = $1
        group by formsanswersid, formcode, formsanswersuserinformer, formsanswerslatitude, formsanswerslongitude
    ) fa 
    `
}

/**
 * Query fired on notification 
 * 
 * @param {*} fCode 
 * @param {*} lat 
 * @param {*} lon 
 * @param {*} buffer 
 * @param {*} db_schema 
 */
sql_query.notifybyIdWithFia = (fCode, lat, lon, buffer, timeStart, timeEnd,  db_schema, userSchema) => {
    console.log('>>> notifybyId ')
    let clippedGeom = `ST_AsGeoJSON(geom) as formsanswersgeom`
    let whereClause = ''

    if((lat && lon && buffer) && (!timeStart && !timeEnd)) {
        clippedGeom = `ST_AsGeoJSON(ST_Intersection(geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))) as formsanswersgeom`
        whereClause = `
            and ST_Intersects(fa.geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))
            and f.code = '${fCode}'
            `
    }
    else if((!lat && !lon && !buffer) && (timeStart && timeEnd)) {
        whereClause = `
            and f.code = '${fCode}'
            and fia.dtfilling BETWEEN '${timeStart}' AND '${timeEnd}'
            `
    }
    else if((lat && lon && buffer) && (timeStart && timeEnd)) {
        clippedGeom = `ST_AsGeoJSON(ST_Intersection(geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))) as formsanswersgeom`
        whereClause = `
            and ST_Intersects(fa.geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))
            and f.code = '${fCode}'
            and fia.dtfilling BETWEEN '${timeStart}' AND '${timeEnd}'
            `
    }
    else if((!lat && !lon && !buffer) && (!timeStart && !timeEnd) && (tempFormType)) {
        whereClause = `
            and f.code = '${fCode}'
        `
    }
        
    /* if(lat && lon && buffer) {
        clippedGeom = `ST_AsGeoJSON(ST_Intersection(geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))) as formsanswersgeom`
        whereClause = `
            and ST_Intersects(fa.geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))
            `
    } */

    return `
    select array_to_json(array_agg(fa))
    from
    (
        select
            fa.id as formsanswersid, 
            f.code as formcode,
            ui.id as formsanswersuserinformer,
            fa.latitude as formsanswerslatitude,
            fa.longitude as formsanswerslongitude,
            ${clippedGeom}
            , json_agg(json_build_object(
                'fieldsanswersid', fia.id, 
                'fieldsanswersfieldsid',fia.idfields,
                'fieldname', ff."name", 
                'fieldsanswersvalue', fia.value, 
                'fieldsanswersdtfilling',fia.dtfilling
                ) order by fia.dtfilling
            ) as array_to_json
        from ${db_schema}.formsanswers fa
        inner join ${db_schema}.forms f on (fa.idforms = f.id )
        inner join ${db_schema}.fieldsanswers fia on (fia.idformsanswers = fa.id) 
        inner join ${db_schema}.fields ff on (ff.id = fia.idfields)
        inner join ${userSchema}.users ui on fa.idusersinformer = ui.id
        
        where 1=1 
        ${whereClause}
        and fa.id = $1
        group by formsanswersid, formcode, formsanswersuserinformer, formsanswerslatitude, formsanswerslongitude
    ) fa 
    `
}

/**
 * Query fired on notification 
 * 
 * @param {*} lat 
 * @param {*} lon 
 * @param {*} buffer 
 * @param {*} db_schema 
 */
sql_query.notifybyId = (lat, lon, buffer, timeStart, timeEnd, fiaAttribute, userEmail, db_schema, userSchema) => {
    console.log('>>> notifybyId ')
    let clippedGeom = `ST_AsGeoJSON(geom) as formsanswersgeom`
    let whereClause = '1=1'
    let fieldsTable = ''
    let fieldsAnswersColumns = ''

    if(lat && lon && buffer) {
        clippedGeom = `ST_AsGeoJSON(ST_Intersection(geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))) as formsanswersgeom`
        whereClause = `${whereClause}
            and ST_Intersects(fa.geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))`
    }
    if(timeStart && timeEnd) {
        whereClause = `${whereClause}
            and fia.dtfilling BETWEEN '${timeStart}' AND '${timeEnd}'`
    }

    if(userEmail) {
        whereClause = `${whereClause} 
            and ui.id = '${userEmail}'`
    }
    
    if(fiaAttribute) {
        fieldsTable = `inner join fields ff on (ff.id = fia.idfields)`
        whereClause = `${whereClause}
            and ff."name" = '${fiaAttribute}'`
        fieldsAnswersColumns = `, json_agg(json_build_object(
            'fieldsanswersfieldsid',fia.idfields,
            'fieldname', ff."name", 
            'fieldsanswersvalue', fia.value, 
            'fieldsanswersdtfilling', fia.dtfilling
            ) order by fia.dtfilling 
        ) as array_to_json`
    }

    return `
    select array_to_json(array_agg(fa))
    from
    (
        select
            fa.id as formsanswersid, 
            f.code as formcode,
            ui.id as formsanswersuserinformer,
            fa.latitude as formsanswerslatitude,
            fa.longitude as formsanswerslongitude,
            ${clippedGeom}
            ${fieldsAnswersColumns}
        from ${db_schema}.formsanswers fa
        inner join ${db_schema}.forms f on (fa.idforms = f.id )
        inner join ${db_schema}.fieldsanswers fia on (fia.idformsanswers = fa.id) 
        inner join ${userSchema}.users ui on fa.idusersinformer = ui.id
        ${fieldsTable}
        where 
            ${whereClause}
            and fa.id = $1
        group by formsanswersid, formcode, formsanswersuserinformer, formsanswerslatitude, formsanswerslongitude
    ) fa 
    `
}

/**
 * Query to get all formsAnswers for the given spatial point with its buffer range and its fieldAnswers (attributes) 
 * belonging to a specific forms.code
 * 
 * @param {number} fCode form code/ form type
 * @param {comma-seperated-numbers} bbox 
 * @param {string} db_schema 
 * @returns {string} 
 */
sql_query.dataByBbox = (fCode, bbox, db_schema, userSchema) => {
    console.log('>>> dataByBbox ')
    /* 
    const returnQuery = `
    select array_to_json(array_agg(fa))
    from
    (
    select 
        fa.id as formsanswersid, 
        f.code as formcode, 
        ui.id as formsanswersuserinformer, 
        fa.latitude as formsanswerslatitude,
        fa.longitude as formsanswerslongitude,
        ST_AsGeoJSON(ST_Intersection(geom, ST_MakeEnvelope(${bbox}, 4326))) as formsanswersgeom,
        (
            select array_to_json(array_agg(fia))
            from (
                select 
                    fia.id as fieldsanswersid,
                    fia.idfields as fieldsanswersfieldsid,
                    ff.name as fieldname,
                    fia.value as fieldsanswersvalue,
                    fia.dtfilling as fieldsanswersdtfilling
                from 
                    ${db_schema}.fieldsanswers fia,
                    ${db_schema}.fields ff
                WHERE
                    fia.idformsanswers = fa.id
                    and fia.idfields = ff.id 
                ORDER BY fia.dtfilling
            ) fia
        ) as fias
    from 
        ${db_schema}.formsanswers fa
        inner join ${db_schema}.forms f on fa.idforms = f.id
        inner join ${userSchema}.users ui on fa.idusersinformer = ui.id
        and geom && ST_MakeEnvelope(${bbox}, 4326)
    where
        f.code = '${fCode}'
    ) fa `
    return returnQuery
     */

    return `
    select array_to_json(array_agg(fa))
    from
    (
        select
            fa.id as formsanswersid, 
            f.code as formcode,
            ui.id as formsanswersuserinformer,
            fa.latitude as formsanswerslatitude,
            fa.longitude as formsanswerslongitude,
            ST_AsGeoJSON(geom) as formsanswersgeom
            , json_agg(json_build_object(
                'fieldsanswersid', fia.id, 
                'fieldsanswersfieldsid',fia.idfields,
                'fieldname', ff."name", 
                'fieldsanswersvalue', fia.value, 
                'fieldsanswersdtfilling',fia.dtfilling
                ) order by fia.dtfilling
            ) as array_to_json
        from ${db_schema}.formsanswers fa
        inner join ${db_schema}.forms f on (fa.idforms = f.id )
        inner join ${db_schema}.fieldsanswers fia on (fia.idformsanswers = fa.id) 
        inner join ${db_schema}.fields ff on (ff.id = fia.idfields)
        inner join ${userSchema}.users ui on fa.idusersinformer = ui.id
        
        where 1=1 
            and ST_Intersects(fa.geom, ST_MakeEnvelope(${bbox}, 4326)) 
            and f.code = '${fCode}'
        group by formsanswersid, formcode, formsanswersuserinformer, formsanswerslatitude, formsanswerslongitude
    ) fa 
    `
}

sql_query.formAnswersByBbox = (fCode, bbox, db_schema, userSchema) => {
    console.log('>>> formAnswersByBbox ')

    if(!(fCode && bbox))
        return ''

    return `
    select array_to_json(array_agg(fa))
    from
    (
        select
            fa.id as formsanswersid, 
            f.code as formcode,
            ui.id as formsanswersuserinformer,
            fa.latitude as formsanswerslatitude,
            fa.longitude as formsanswerslongitude,
            ST_AsGeoJSON(geom) as formsanswersgeom
        from ${db_schema}.formsanswers fa
        inner join ${db_schema}.forms f on (fa.idforms = f.id )
        inner join ${userSchema}.users ui on fa.idusersinformer = ui.id
        where 1=1 
            and ST_Intersects(fa.geom, ST_MakeEnvelope(${bbox}, 4326)) 
            and f.code = '${fCode}'
        group by formsanswersid, formcode, formsanswersuserinformer, formsanswerslatitude, formsanswerslongitude
    ) fa 
    `
}

/**
 * Generic query to get all formsAnswers for the given spatial point with its buffer range and its fieldAnswers (attributes) 
 * belonging to a specific forms.code
 * 
 * @param {number} fCode form code/ form type
 * @param {number} lat latitude of the point of interest
 * @param {number} lon longitude of the point of interest
 * @param {number} buffer radius of buffer to create in meters from the point of interest
 * @param {number} timeStart start of time range
 * @param {number} timeEnd end of time range
 * @param {number} limit number of formsAnswers limited to
 * @param {string} db_schema 
 * @returns {string} 
 */
// https://gis.stackexchange.com/questions/335718/clipping-polygons-and-lines-at-exact-borders-within-postgis
sql_query.dataQuery = (fCode, lat, lon, buffer, timeStart, timeEnd, limit, db_schema, userSchema) => {
    console.log('>>> dataQuery')
    let clippedGeom = `ST_AsGeoJSON(geom) as formsanswersgeom`
    let whereClause = ''
    let limitClause = ''
    if(limit)
        limitClause = `limit ${limit}`

    if((lat && lon && buffer) && (!timeStart && !timeEnd)){
        clippedGeom = `ST_AsGeoJSON(ST_Intersection(geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))) as formsanswersgeom`
        whereClause = `
            and ST_Intersects(fa.geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))
            and f.code = '${fCode}'
            `
    }
    else if((!lat && !lon && !buffer) && (timeStart && timeEnd))
        whereClause = `
            and f.code = '${fCode}'
            and fia.dtfilling BETWEEN '${timeStart}' AND '${timeEnd}'
            `
    else if((lat && lon && buffer) && (timeStart && timeEnd)){
        clippedGeom = `ST_AsGeoJSON(ST_Intersection(geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))) as formsanswersgeom`
        whereClause = `
            and ST_Intersects(fa.geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))
            and f.code = '${fCode}'
            and fia.dtfilling BETWEEN '${timeStart}' AND '${timeEnd}'
            `
    }
    else if((!lat && !lon && !buffer) && (!timeStart && !timeEnd) && (tempFormType))
        whereClause = `
            and f.code = '${fCode}'
            `

    return `
    select array_to_json(array_agg(fa))
    from
    (
        select
            fa.id as formsanswersid, 
            f.code as formcode,
            ui.id as formsanswersuserinformer,
            fa.latitude as formsanswerslatitude,
            fa.longitude as formsanswerslongitude,
            ${clippedGeom}
            , json_agg(json_build_object(
                'fieldsanswersid', fia.id, 
                'fieldsanswersfieldsid',fia.idfields,
                'fieldname', ff."name", 
                'fieldsanswersvalue', fia.value, 
                'fieldsanswersdtfilling',fia.dtfilling
                ) order by fia.dtfilling
            ) as array_to_json
        from ${db_schema}.formsanswers fa
        inner join ${db_schema}.forms f on (fa.idforms = f.id )
        inner join ${db_schema}.fieldsanswers fia on (fia.idformsanswers = fa.id) 
        inner join ${db_schema}.fields ff on (ff.id = fia.idfields)
        inner join ${userSchema}.users ui on fa.idusersinformer = ui.id
        left join ${db_schema}.editdata ed on (fia.id = ed.idfieldsanswers)
        
        where 1=1 ${whereClause}
            AND ed.idfieldsanswers IS NULL
        group by formsanswersid, formcode, formsanswersuserinformer, formsanswerslatitude, formsanswerslongitude
        ${limitClause}
    ) fa 
    `
}

/**
 * Query to get all formsAnswers for the given spatial point with its buffer range
 * belonging to a specific forms.code
 * 
 * @param {number} fCode form code/ form type
 * @param {number} lat latitude of the point of interest
 * @param {number} lon longitude of the point of interest
 * @param {number} buffer radius of buffer to create in meters from the point of interest
 * @param {number} limit number of formsAnswers limited to
 * @param {string} db_schema 
 * @returns {string} 
 */
sql_query.formsAnswersData = (fcode, lat, lon, buffer, timeStart, timeEnd, limit, fiaAttribute, userEmail, db_schema, userSchema) => {
    console.log('>>> formsData ')
    let clippedGeom = `ST_AsGeoJSON(geom) as formsanswersgeom`
    let whereClause = '1=1'
    let fieldsTable = ''
    let fieldsAnswersColumns = ''

    let limitClause = ''
    if(limit)
        limitClause = `limit ${limit}`

    if(lat && lon && buffer) {
        clippedGeom = `ST_AsGeoJSON(ST_Intersection(geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))) as formsanswersgeom`
        whereClause = `${whereClause}
            and ST_Intersects(fa.geom, ST_Buffer(ST_GeogFromText('POINT(${lon} ${lat})'), ${buffer}))
            `
    }

    if(timeStart && timeEnd) {
        whereClause = `${whereClause}
            and fia.dtfilling BETWEEN '${timeStart}' AND '${timeEnd}'
            `
    }

    if(userEmail) {
        whereClause = `${whereClause} 
            and ui.id = '${userEmail}'`
    }

    if(fiaAttribute) {
        fieldsTable = `inner join fields ff on (ff.id = fia.idfields)`
        whereClause = `${whereClause}
            and ff."name" = '${fiaAttribute}'
            `
        fieldsAnswersColumns = `, json_agg(json_build_object(
            'fieldsanswersfieldsid',fia.idfields,
            'fieldname', ff."name", 
            'fieldsanswersvalue', fia.value, 
            'fieldsanswersdtfilling',fia.dtfilling
            ) order by fia.dtfilling 
        ) as array_to_json`
    }

    return `
    select array_to_json(array_agg(fa))
    from
    (
        select
            fa.id as formsanswersid, 
            f.code as formcode,
            ui.id as formsanswersuserinformer,
            fa.latitude as formsanswerslatitude,
            fa.longitude as formsanswerslongitude,
            ${clippedGeom}
            ${fieldsAnswersColumns}
        from ${db_schema}.formsanswers fa
        inner join ${db_schema}.forms f on (fa.idforms = f.id )
        inner join ${db_schema}.fieldsanswers fia on (fia.idformsanswers = fa.id) 
        inner join ${userSchema}.users ui on fa.idusersinformer = ui.id
        left join ${db_schema}.editdata ed on (fia.id = ed.idfieldsanswers)
        ${fieldsTable}
        where 
            ${whereClause}
            and f.code = '${fcode}'
            and ed.idfieldsanswers IS NULL
        group by formsanswersid, formcode, formsanswersuserinformer, formsanswerslatitude, formsanswerslongitude
        ${limitClause}
    ) fa 
    `
}

/**
 * Query to get all formsAnswers for the given spatial point with its buffer range
 * belonging to a specific forms.code
 * 
 * @param {number} faid formsAnswersId
 * @param {number} lat latitude of the point of interest
 * @param {number} lon longitude of the point of interest
 * @param {number} buffer radius of buffer to create in meters from the point of interest
 * @param {number} limit number of formsAnswers limited to
 * @param {string} db_schema 
 * @returns {string} 
 */
sql_query.fieldsAnswersData = (faid, timeStart, timeEnd, db_schema, userSchema) => {
    console.log('>>> fieldsAnswersData ')
    let clippedGeom = `ST_AsGeoJSON(geom) as formsanswersgeom`
    let whereClause = ''

    if(timeStart && timeEnd)
        whereClause = `
            and ((fia.dtfilling BETWEEN '${timeStart}' AND '${timeEnd}') or fia.dtfilling is null)
            `

    return `
    select array_to_json(array_agg(fa))
    from
    (
        select
            fa.id as formsanswersid, 
            f.code as formcode,
            ui.id as formsanswersuserinformer,
            ui.nickname as formsanswersuserinformernickname,
            ui.institution as formsanswersuserinformerinstitution,
            fa.latitude as formsanswerslatitude,
            fa.longitude as formsanswerslongitude,
            ${clippedGeom}
            , json_agg(json_build_object(
                'fieldsanswersid', fia.id, 
                'fieldsanswersfieldsid',fia.idfields,
                'fieldname', ff."name", 
                'fieldsanswersvalue', fia.value, 
                'fieldsanswersdtfilling',fia.dtfilling
                ) order by fia.dtfilling 
            ) as array_to_json
        from ${db_schema}.formsanswers fa
        inner join ${db_schema}.forms f on (fa.idforms = f.id )
        inner join ${db_schema}.fieldsanswers fia on (fia.idformsanswers = fa.id) 
        inner join ${db_schema}.fields ff on (ff.id = fia.idfields)
        inner join ${userSchema}.users ui on fa.idusersinformer = ui.id
        where 
            1=1 
            ${whereClause}
            and fa.id = '${faid}'
        group by formsanswersid, formcode, formsanswersuserinformer, formsanswersuserinformernickname, formsanswersuserinformerinstitution, formsanswerslatitude, formsanswerslongitude
    ) fa 
    `
}

sql_query.getLastDataForms = (type, id, db_schema, userSchema) => {
    console.log(">>> getLastDataForms")
    return `select array_to_json(array_agg(fa))
    from(
      select
          fa.id as formsanswersid,
          f.code as formcode,
          ui.id as formsanswersuserinformer,
          fa.latitude as formsanswerslatitude,
          fa.longitude as formsanswerslongitude,
          json_agg(json_build_object(
              'fieldsanswersfieldsid',fia.idfields,
            'fieldname', ff."name", 
            'fieldsanswersvalue', fia.value, 
            'fieldsanswersdtfilling',fia.dtfilling
          ) order by fia.dtfilling
        ) as array_to_json
      from ${db_schema}.formsanswers fa
        inner join ${db_schema}.forms f on (fa.idforms = f.id )
        inner join ${db_schema}.fieldsanswers fia on (fia.idformsanswers = fa.id) 
        inner join ${userSchema}.users ui on fa.idusersinformer = ui.id
        inner join ${db_schema}.fields ff on (ff.id = fia.idfields)
        left join ${db_schema}.editdata ed on (fia.id = ed.idfieldsanswers)
      where
          fa.id = ${id}
          and f.code = '${type}'
          and ed.idfieldsanswers IS NULL
      group by formsanswersid, formcode, formsanswersuserinformer, formsanswerslatitude, formsanswerslongitude
    )fa
    `
}

sql_query.getLastDataPluv = (type, id, db_schema, userSchema) => {
    console.log(">>> getLastDataPluv")

    return `select array_to_json(array_agg(fa))
    from(
      select
          fap.id as formsanswersid,
          f.code as formcode,
          ui.id as formsanswersuserinformer,
          fap.latitude as formsanswerslatitude,
          fap.longitude as formsanswerslongitude,
          json_agg(json_build_object(
            'fieldsanswersfieldsid',fia.idfields,
            'fieldname', ff."name", 
            'fieldsanswersvalue', fia.value, 
            'fieldsanswersdtfilling',fia.dtfilling
          ) order by fia.dtfilling
        ) as array_to_json
      from ${db_schema}.formsanswers fa
        inner join ${db_schema}.formsanswers fap on (fa.idusersinformer = fap.idusersinformer)
        inner join ${db_schema}.forms f on (fap.idforms = f.id )
        inner join ${db_schema}.fieldsanswers fia on (fia.idformsanswers = fap.id) 
        inner join ${userSchema}.users ui on fap.idusersinformer = ui.id
        inner join ${db_schema}.fields ff on (ff.id = fia.idfields)
        left join ${db_schema}.editdata ed on (fia.id = ed.idfieldsanswers)
      where
          fa.id = ${id}
          and ed.idfieldsanswers IS NULL
          and f.code = '${type}'
      group by formsanswersid, formcode, formsanswersuserinformer, formsanswerslatitude, formsanswerslongitude
      order by fap.id desc
      limit 1
    )fa
    `
}   

/**
 * Query to get all forms data in JSON format
 * 
 * @param {string} db_schema 
 * @returns {JSON} 
 */
sql_query.getAllFormsTypesWithoutTime = (db_schema) => {
    return `
    select array_to_json(array_agg(fa))
    from
    (
        select id, code, name, description, active from ${db_schema}.forms
    ) fa`

}

/**
 * Query to get all forms with their distinct timestamps in JSON format
 * 
 * @param {string} db_schema 
 * @returns {JSON} 
 */
sql_query.getAllFormsTypesWithTime = (db_schema) => {
    return `
    select array_to_json(array_agg(formsagg))
    from (	
        select
        f.id, f.code, f.name, f.description, f.active,
        (
            select jsonb_agg(distinct fia.dtfilling) as available_times
            from 
                ${db_schema}.fieldsanswers fia, ${db_schema}.formsanswers fa
            where
                --fia.idformsanswers in (select id from ${db_schema}.formsanswers where idforms = (select id from ${db_schema}.forms where code = 'susceptibilidade_inundacao' ) )
                fia.idformsanswers = fa.id and fa.idforms = f.id
            order by available_times
        )
        from 
            ${db_schema}.formsanswers fa right outer join ${db_schema}.forms f on fa.idforms = f.id 
        group by f.id
    ) formsagg`

}

// NOT_USED. but handy to get min and max of time range
sql_query.getAllFormsTypesWithMinAndMaxTime = (db_schema) => {
    return `
    select array_to_json(array_agg(formsagg))
    from (	
        select
        f.id, f.code, f.name, f.description, f.active,
        (
            select json_build_object(
                'mindate', min(fia.dtfilling),
                'maxdate', max(fia.dtfilling)
            ) as timerange
            from 
                ${db_schema}.fieldsanswers fia, ${db_schema}.formsanswers fa
            where
                --fia.idformsanswers in (select id from formsanswers where idforms = (select id from forms where code = 'susceptibilidade_inundacao' ) )
                fia.idformsanswers = fa.id and fa.idforms = f.id 
        )
        from 
            formsanswers fa
            inner join ${db_schema}.forms f on fa.idforms = f.id 
        group by f.id    
    ) formsagg`

}