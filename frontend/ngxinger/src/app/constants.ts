enum Teams {
    NEUTRAL = 0,
    ENLIGHTENMENT = 1,
    RESISTANCE = 2,
}

export class Constants {
    // The teams
    // XXX enum
    public static Teams = Teams;
    public static TeamNames = {
        0: 'Neutral',
        1: 'Enlightenment',
        2: 'Resistance',
    };

    // Map default zoom
    public static MAP_X = -96;
    public static MAP_Y = 41.25;
    public static MAP_Z = 10;
}
