import 'dart:async';

enum RegisterStep { unknown, inputInfo, uploadPhoto, inputCredential }

class RegisterRepository {
  final _stepController = StreamController<RegisterStep>();

  Stream<RegisterStep> get step async* {
    yield RegisterStep.unknown;
    yield* _stepController.stream;
  }

  void dispose() {
    _stepController.close();
  }
}