# encoding: utf-8
from __future__ import absolute_import, division, with_statement

import json

from tornado import websocket, web, ioloop


class Handler(websocket.WebSocketHandler):
    def write_message(self, message, binary=False):
        if not binary:
            message = json.dumps(message)
            import time
            time.sleep(0.1)
        super(Handler, self).write_message(message, binary)

    def on_message(self, message):
        message = json.loads(message)
        self._handle_message(message)

    def check_origin(self, origin):
        return True

    def _handle_message(self, message):
        if message == 'new':
            self.write_message("w")
        else:
            self.write_message(self.logic(message))

    def logic(self, message):
        spaceship = message['spaceship']
        robots = sorted(message['robots'], key=lambda student: student['left'])
        sol = {"a": 0, "d": 0, "w": 0, "s": 0}
        if spaceship['top'] >= 80:
            sol["w"] += 2
        elif spaceship['top'] <= 10:
            sol["s"] += 2
        if spaceship['left'] >= 80:
            sol["a"] += 2
        elif spaceship['left'] <= 10:
            sol["d"] += 2
        for num, robot in enumerate(robots):
            if spaceship['top'] - robot['top'] <= 16:
                sol['w'] -= 1
                if num - 1 >= 0 and spaceship['top'] - robots[num - 1]['top'] <= 12:
                    sol['a'] += 2
                if num + 1 < 12 and spaceship['top'] - robots[num + 1]['top'] <= 12:
                    sol['d'] += 1
            if num + 1 < 12 and num -1 >= 0 and robots[num + 1]['top'] <= 15 and robots[num - 1]['top'] <= 15:
                sol['s'] += 1

        return sorted(sol.items(), key=lambda k: k[1])[-1][0]


class CustomApplication(web.Application):
    def start(self, port):
        from tornado.httpserver import HTTPServer
        server = HTTPServer(self)
        server.bind(port)
        server.start()


app = CustomApplication([
    (r'/game', Handler)
])

if __name__ == '__main__':
    app.start(8000)
    ioloop.IOLoop.instance().start()
