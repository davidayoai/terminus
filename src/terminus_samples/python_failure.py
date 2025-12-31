#!/usr/bin/env python3
"""
Terminus Sample: Intentional LLM Failure Case

This file demonstrates a class of Python tasks that
language models often fail to reason about correctly:
dynamic behavior via metaclasses + runtime mutation.
"""

class Meta(type):
    def __call__(cls, *args, **kwargs):
        obj = super().__call__(*args, **kwargs)
        obj.injected = lambda x: x / 0  # subtle runtime failure
        return obj

class Exploit(metaclass=Meta):
    def run(self):
        return self.injected(1)

if __name__ == "__main__":
    e = Exploit()
    print(e.run())
