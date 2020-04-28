import os

import ngxinger

ngxinger.app.config.from_mapping(
    {"DSN": os.environ["NGXINGER_DSN"],}
)

app = ngxinger.app
