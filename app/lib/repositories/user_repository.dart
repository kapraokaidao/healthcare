import 'dart:async';
import 'package:healthcare_app/utils/http_client.dart';

enum UserGender { male, female }

class UserRepository {
  Future<void> updateAcceptedTerms() async {
    await HttpClient.put('/users/accept', {});
  }
}