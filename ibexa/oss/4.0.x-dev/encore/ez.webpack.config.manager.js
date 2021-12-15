const fs = require('fs');
const ibexifyEntryName = (entryName) => {
    const ibexaEntryName = entryName.replace('ezplatform-', 'ibexa-').replace('ezcommerce-', 'ibexacommerce-');

    return ibexaEntryName;
}
const findItems = (ibexaConfig, entryName) => {
    const items = ibexaConfig.entry[entryName];

    if (!items) {
        throw new Error(`Couldn't find entry with name: "${entryName}". Please check if there is a typo in the name.`);
    }

    return items;
};
const replace = ({ ibexaConfig, eZConfig, entryName, itemToReplace, newItem }) => {
    const config = ibexaConfig ?? eZConfig;
    const ibexaEntryName = ibexifyEntryName(entryName);
    const items = findItems(config, ibexaEntryName);
    const indexToReplace = items.indexOf(fs.realpathSync(itemToReplace));

    if (indexToReplace < 0) {
        throw new Error(`Couldn't find item "${itemToReplace}" in entry "${ibexaEntryName}". Please check if there is a typo in the name.`);
    }

    items[indexToReplace] = newItem;
};
const remove = ({ ibexaConfig, eZConfig, entryName, itemsToRemove }) => {
    const config = ibexaConfig ?? eZConfig;
    const ibexaEntryName = ibexifyEntryName(entryName);
    const items = findItems(config, ibexaEntryName);
    const realPathItemsToRemove = itemsToRemove.map((item) => fs.realpathSync(item));

    config.entry[ibexaEntryName] = items.filter((item) => !realPathItemsToRemove.includes(item));
};
const add = ({ ibexaConfig, eZConfig, entryName, newItems }) => {
    const config = ibexaConfig ?? eZConfig;
    const ibexaEntryName = ibexifyEntryName(entryName);
    const items = findItems(config, ibexaEntryName);

    config.entry[ibexaEntryName] = [...items, ...newItems];
};

module.exports = {
    replace,
    remove,
    add
};
