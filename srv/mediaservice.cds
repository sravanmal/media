using { media.db as my } from '../db/schema';


service MediaService @(path: 'MediaService'){
    entity media as projection on my.media
}